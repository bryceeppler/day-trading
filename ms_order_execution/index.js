const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MESSAGE_QUEUE } = require("./shared/lib/enums");
const { connectToRabbitMQ } = require("./shared/config/rabbitmq");
const StockTransaction = require("./shared/models/stockTransactionModel");
const WalletTransaction = require("./shared/models/walletTransactionModel");
const { ORDER_STATUS } = require("./shared/lib/enums");

const redis = require("./shared/config/redis");

redis.connect()


const app = express();
app.use((req, res, next) =>
{
  console.log(`${req.method} ${req.url}`);
  next();
});
app.us;
app.use(bodyParser.json());

const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { authSource: "admin" });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function ()
{
  console.log("Connected successfully");
});


const RabbitSetup = async () =>
{
  try
  {
    const { connection, channel } = await connectToRabbitMQ(process.env.RABBITMQ_URI);
    await channel.assertQueue(MESSAGE_QUEUE.EXECUTE_ORDER, { durable: true });
    await channel.consume(
      MESSAGE_QUEUE.EXECUTE_ORDER,
      async (data) =>
      {
        if (data)
        {
          const message = JSON.parse(data.content.toString());
          // console.log("Recieved Execute Order Message: ", message);
          executeOrder(message);
        }
      },
      { noAck: true }
    );
  } catch (error)
  {
    console.error('Error connecting to RabbitMQ:', error);
  }
}

const executeOrder = async (message) =>
{

  const stockTxId = message.stock_tx_id;
  const matchedStockTxId = message.matched_stock_tx_id;
  const action = message.action;
  const quantityStockInTransit = message.quantity;
  try
  {

    // console.log("checking existingStockTx");

		const existingStockTx = await redis.fetchStockTransaction(stockTxId)


    if (!existingStockTx)
    {
      console.log('Stock Transaction not found');

    } else
    {
      // console.log("StockTx EXISTS!");
      const existingPortfolioDocumentAndStockId = await redis.fetchPortfolio(existingStockTx.user_id, existingStockTx.stock_id );

			const stockUpdate = await redis.fetchStock(existingStockTx.stock_id);

      //if stock transaction is complete AND a BUY order AND FULFILLED COMPLETELY
      if (action === "COMPLETED" && existingStockTx.is_buy === true && quantityStockInTransit === existingStockTx.quantity)
      {
        // console.log("Checking if Portfolio Document Exists");

        if (existingPortfolioDocumentAndStockId)
        {

          // console.log("Portfolio Document Exists");

          try
          {

            existingStockTx.order_status = 'COMPLETED';
            // update stock price in stock collection
            stockUpdate.current_price = existingStockTx.stock_price;

            // console.log("Updating Quantity");
            let newQuantity = existingPortfolioDocumentAndStockId.quantity_owned + existingStockTx.quantity;

            // console.log("Old quantity", existingPortfolioDocumentAndStockId.quantity_owned)
            // console.log("Quantity to add:", existingStockTx.quantity)
            // console.log("New Quantity:", newQuantity);

            existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;
						

						const promises = [
							redis.updatePortfolio(existingPortfolioDocumentAndStockId),
							redis.updateStockTransaction(existingStockTx),
							redis.updateStock(stockUpdate),
						]

						await Promise.all(promises)
						
     

            // console.log("Transaction updated: ",
              { existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId, existingStockTx: existingStockTx });
            return;
          }
          catch (error)
          {
						console.log(error)
            throw new Error('Error updating portfolio document:', error);
          }
        }
      }

      //if stock transaction is complete AND a BUY order AND PARTIALLY FULFILLED
      if (action === "COMPLETED" && existingStockTx.is_buy === true && quantityStockInTransit !== existingStockTx.quantity)
      {
        // console.log("In Partial order flow - checking if Portfolio Document Exists");

        if (existingPortfolioDocumentAndStockId)
        {

          // console.log("Portfolio Document Exists");

          try
          {

            existingStockTx.order_status = 'PARTIAL_FULFILLED';
            // update stock price in stock collection
            stockUpdate.current_price = existingStockTx.stock_price;

            // console.log("Updating Quantity");
            let newQuantity = existingPortfolioDocumentAndStockId.quantity_owned + quantityStockInTransit;

            // console.log("Old quantity", existingPortfolioDocumentAndStockId.quantity_owned)
            // console.log("Quantity to add:", quantityStockInTransit)
            // console.log("New Quantity:", newQuantity);

            existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;

          
						const user = await redis.fetchUser(existingStockTx.user_id)

						const existingWalletTx = await redis.fetchWalletTransactionFromParams({ stock_tx_id: stockTxId });
       
            existingWalletTx.is_deleted = true;


            // create new stockTx for partially fulfilled order  
            const newStockTransaction = new StockTransaction({
              stock_id: existingStockTx.stock_id,
              user_id: existingStockTx.user_id,
              parent_stock_tx_id: stockTxId,
              portfolio_id: existingStockTx.portfolio_id,
              order_status: 'COMPLETED',
              is_buy: true,
              order_type: existingStockTx.order_type,
              stock_price: existingStockTx.stock_price,
              quantity: quantityStockInTransit,
              is_deleted: false
            });

            let amountSpent = quantityStockInTransit * existingStockTx.stock_price;
            let refund = existingWalletTx.amount - amountSpent;
            let newBalance = refund + user.balance;

            // console.log("OLD user.balance:", user.balance);
            // console.log("Refund", refund);
            // console.log("NEW user.balance:", newBalance);
            user.balance = newBalance;
            // console.log("User balance updated.");
            // create new walletTx for partially fulfilled order  
            const newWalletTransaction = new WalletTransaction({
              user_id: existingStockTx.user_id,
              is_debit: false,
              amount: amountSpent,
              is_deleted: false,
							stock_tx_id: newStockTransaction._id
            });

            newStockTransaction.wallet_tx_id = newWalletTransaction._id
         
						const promises = [
							redis.updateWalletTransaction(existingWalletTx),
							redis.createStockTransaction(newStockTransaction),
							redis.createWalletTransaction(newWalletTransaction),
							redis.updatePortfolio(existingPortfolioDocumentAndStockId),
							redis.updateStockTransaction(existingStockTx),
							redis.updateStock(stockUpdate),
						]

						await Promise.all(promises)
						
						
            // console.log("Transaction Complete: ", {
            //   existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId,
            //   newStockTransaction: newStockTransaction,
            //   newWalletTransaction: newWalletTransaction,
            //   existingStockTx: existingStockTx
            // });
            return;
          }
          catch (error)
          {
            return new Error({ message: `Internal Server Error: ${error}` });
          }
        }
      }

      // if stock transaction is cancelled OR it expires AND is a BUY order
      if ((action === "CANCELED" || action === "EXPIRED") && existingStockTx.is_buy === true)
      {
        try
        {
          if (action === "CANCELED") { existingStockTx.order_status = 'CANCELED'; }
          if (action === "EXPIRED")
          {
            // check if there is a stockTx with this stockTxId in the parent_stock_tx_id field
            // if yes, this order was partially filled and should be marked "PARTIAL_FULFILLED"
						const parentStockTx = await redis.fetchStockTransactionFromParams({ parent_stock_tx_id: stockTxId });
            if (parentStockTx)
            {
              existingStockTx.order_status = 'PARTIAL_FULFILLED';
            } else
            {
              existingStockTx.order_status = 'EXPIRED';
            };
          }
					const existingWalletTx = await redis.fetchWalletTransactionFromParams({ stock_tx_id: stockTxId });

					const user = await redis.fetchUser(existingStockTx.user_id)
          let newBalance = existingWalletTx.amount + user.balance;


          // console.log("OLD user.balance:", user.balance)
          // console.log("existingWalletTx.amount:", existingWalletTx.amount)
          // console.log("NEW user.balance:", newBalance)

          user.balance = newBalance;

          existingStockTx.is_deleted = true;
          existingWalletTx.is_deleted = true;

					const promises = [
						redis.updateWalletTransaction(existingWalletTx),
						redis.updateStockTransaction(existingStockTx),
						redis.updateUser(user)
					]

					await Promise.all(promises)

          // console.log("Execution Complete: ", {
          //   existingStockTx: existingStockTx,
          //   existingWalletTx: existingWalletTx,
          //   user: user
          // });
          return;
        } catch (error)
        {
          return new Error('Error returning amount spent to user balance:', error)
        }

      }

      //if stock transaction is complete AND a SELL order AND FULFILLED COMPLETELY
      if (action === "COMPLETED" && existingStockTx.is_buy === false && quantityStockInTransit === existingStockTx.quantity)
      {
        try
        {

          //change order status to complete
          existingStockTx.order_status = 'COMPLETED';
          stockUpdate.current_price = existingStockTx.stock_price;

          //add money to user's wallet

					const user = await redis.fetchUser(existingStockTx.user_id)

          let profit = existingStockTx.quantity * existingStockTx.stock_price;
          let newBalance = profit + user.balance;

          // console.log("OLD user.balance:", user.balance);
          // console.log("Profit", profit);
          // console.log("NEW user.balance:", newBalance);

          user.balance = newBalance;
          // console.log("User balance updated.");
          //create new wallet transaction - in stockTransaction wallet_tx_id field will be empty
          const newWalletTransaction = new WalletTransaction({
            user_id: existingStockTx.user_id,
            stock_tx_id: existingStockTx._id,
            is_debit: false,
            amount: profit,
            is_deleted: false
          });

					
          existingStockTx.wallet_tx_id = newWalletTransaction._id;

					const promises = [
						redis.createWalletTransaction(newWalletTransaction),
						redis.updateStockTransaction(existingStockTx),
						redis.updateStock(stockUpdate),
						redis.updateUser(user)
					]

					await Promise.all(promises)

					

          // console.log("New Wallet Transaction added. ", {
          //   existingStockTx: existingStockTx,
          //   newWalletTransaction: newWalletTransaction,
          //   user: user
          // });
          return;

        } catch (error)
        {
					console.log(error)
          throw new Error('Error making changes:', error);
        }
      }

      //if stock transaction is complete AND a SELL order AND PARTIAL FULFILLED
      if (action === "COMPLETED" && existingStockTx.is_buy === false && quantityStockInTransit !== existingStockTx.quantity)
      {
        try
        {

          //change order status to partially fulfilled
          existingStockTx.order_status = 'PARTIAL_FULFILLED';
          // update stock price in stock collection
          stockUpdate.current_price = existingStockTx.stock_price;

          //add profit money to user's wallet
          const user = await redis.fetchUser(existingStockTx.user_id)

          let profit = quantityStockInTransit * existingStockTx.stock_price;
          let newBalance = profit + user.balance;

          // console.log("OLD user.balance:", user.balance);
          // console.log("Profit", profit);
          // console.log("NEW user.balance:", newBalance);

          user.balance = newBalance;
          // console.log("User balance updated.");
          // add remaining stock quantity back to portfolio
          //let stocksToAddBack = existingStockTx.quantity - quantityStockInTransit;
          //let newStockQuantity = existingPortfolioDocumentAndStockId.quantity_owned + stocksToAddBack;
          //existingPortfolioDocumentAndStockId.quantity_owned = newStockQuantity;

          // find matched order stock transaction

          // new stockTx for partially fulfilled order
          const newStockTransaction = new StockTransaction({
            stock_id: existingStockTx.stock_id,
            user_id: existingStockTx.user_id,
            parent_stock_tx_id: stockTxId,
            portfolio_id: existingStockTx.portfolio_id,
            order_status: 'COMPLETED',
            is_buy: false,
            order_type: existingStockTx.order_type,
            stock_price: existingStockTx.stock_price,
            quantity: quantityStockInTransit,
            is_deleted: false
          });

          // new walletTx for partially fulfilled order                    
          const newWalletTransaction = new WalletTransaction({
            user_id: existingStockTx.user_id,
            is_debit: false,
            amount: profit,
            is_deleted: false,
						stock_tx_id: newStockTransaction._id
          });

          newStockTransaction.wallet_tx_id = newWalletTransaction._id


					const promises = [
						redis.createStockTransaction(newStockTransaction),
						redis.updatePortfolio(existingPortfolioDocumentAndStockId),
						redis.createWalletTransaction(newWalletTransaction),
						redis.updateStockTransaction(existingStockTx),
						redis.updateStock(stockUpdate),
						redis.updateUser(user)
					]

					await Promise.all(promises)

          // console.log("New Stock Transaction added.")
          // console.log("New Wallet Transaction added.")
          return;

        } catch (error)
        {
					console.log(error)
          throw new Error('Error making changes:', error);
        }
      }

      // if stock transaction is cancelled OR it expires AND is a SELL order
      if ((action === "CANCELED" || action === "EXPIRED") && existingStockTx.is_buy === false)
      {
        try
        {
          if (action === "CANCELED") { existingStockTx.order_status = 'CANCELED'; }
          if (action === "EXPIRED")
          {
            const parentStockTx = await redis.fetchStockTransactionFromParams({ parent_stock_tx_id: stockTxId });
            if (parentStockTx)
            {
              existingStockTx.order_status = 'PARTIAL_FULFILLED';
            } else
            {
              existingStockTx.order_status = 'EXPIRED';
            };
          }

					// console.log("Fetiching Child Transactions--------")
					// console.log(stockTxId)


					const childTransactions = await redis.fetchAllStockTransactionFromParams({ parent_stock_tx_id: stockTxId })
          let completedQuantity = existingStockTx.quantity;

          childTransactions.forEach(tx =>
          {
            if (tx.order_status === ORDER_STATUS.COMPLETED)
              completedQuantity -= tx.quantity;
          });


          // check if portfolio entry exists first and if not, make a new one \\ for the next submission
          let newQuantity = completedQuantity + existingPortfolioDocumentAndStockId.quantity_owned;

          // console.log("OLD qunatity owned", existingPortfolioDocumentAndStockId.quantity_owned);
          // console.log("Quantity received back", existingStockTx.quantity);
          // console.log("NEW qunatity owned", newQuantity);

          existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;
          // if the status is not PARTIAL_FULFILLED, then the stockTx is deleted
          if (existingStockTx.order_status !== 'PARTIAL_FULFILLED')
          {
            existingStockTx.is_deleted = true;
          }

					const promises = [
						redis.updatePortfolio(existingPortfolioDocumentAndStockId),
						redis.updateStockTransaction(existingStockTx),
					]

					await Promise.all(promises)
					
          // console.log("Execution Complete: ", {
          //   existingStockTx: existingStockTx,
          //   existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId,
          // });
          // return;

        } catch (error)
        {
					console.log(error)
          throw new Error('Error making changes to Portfolio:', error);
        }
      }
      // console.log("Execution Complete: ", existingStockTx);
      return;
    }
  } catch (error)
  {
		console.log(error)
    throw new Error("Error fetching stock transaction", error);
  }
};


RabbitSetup();
