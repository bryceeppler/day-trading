const Stock = require("./shared/models/stockModel");
const StockTransaction = require("./shared/models/stockTransactionModel");
const WalletTransaction = require("./shared/models/walletTransactionModel");
const Portfolio = require("./shared/models/portfolioModel");
const User = require("./shared/models/userModel");
const { ORDER_STATUS } = require("./shared/lib/enums");

exports.executeOrder2 = async (message) =>
{

  const stockTxId = message.stock_tx_id;
  const matchedStockTxId = message.matched_stock_tx_id;
  const action = message.action;
  const quantityStockInTransit = message.quantity;

  try
  {

    console.log("checking existingStockTx");
    const existingStockTx = await StockTransaction.findOne({ _id: stockTxId });

    if (!existingStockTx)
    {
      throw new Error({ message: 'Stock Transaction not found' });

    } else
    {
      console.log("StockTx EXISTS!");

      const existingPortfolioDocumentAndStockId = await Portfolio.findOne({ _id: existingStockTx.portfolio_id, stock_id: existingStockTx.stock_id });
      const stockUpdate = await Stock.findOne({ _id: existingStockTx.stock_id });

      //if stock transaction is complete AND a BUY order AND FULFILLED COMPLETELY
      if (action === "COMPLETED" && existingStockTx.is_buy === true && quantityStockInTransit === existingStockTx.quantity)
      {
        console.log("Checking if Portfolio Document Exists");

        if (existingPortfolioDocumentAndStockId)
        {

          console.log("Portfolio Document Exists");

          try
          {

            existingStockTx.order_status = 'COMPLETED';
            // update stock price in stock collection
            stockUpdate.current_price = existingStockTx.stock_price;

            console.log("Updating Quantity");
            let newQuantity = existingPortfolioDocumentAndStockId.quantity_owned + existingStockTx.quantity;

            console.log("Old quantity", existingPortfolioDocumentAndStockId.quantity_owned)
            console.log("Quantity to add:", existingStockTx.quantity)
            console.log("New Quantity:", newQuantity);

            existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;

            await existingPortfolioDocumentAndStockId.save();
            await existingStockTx.save();
            await stockUpdate.save();

            console.log("Transaction updated: ",  
            { existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId, existingStockTx: existingStockTx });
            return;
          }
          catch (error)
          {
            throw new Error('Error updating portfolio document:', error);
          }
        }
      }

      //if stock transaction is complete AND a BUY order AND PARTIALLY FULFILLED
      if (action === "COMPLETED" && existingStockTx.is_buy === true && quantityStockInTransit !== existingStockTx.quantity)
      {
        console.log("In Partial order flow - checking if Portfolio Document Exists");

        if (existingPortfolioDocumentAndStockId)
        {

          console.log("Portfolio Document Exists");

          try
          {

            existingStockTx.order_status = 'PARTIAL_FULFILLED';
            // update stock price in stock collection
            stockUpdate.current_price = existingStockTx.stock_price;

            console.log("Updating Quantity");
            let newQuantity = existingPortfolioDocumentAndStockId.quantity_owned + quantityStockInTransit;

            console.log("Old quantity", existingPortfolioDocumentAndStockId.quantity_owned)
            console.log("Quantity to add:", quantityStockInTransit)
            console.log("New Quantity:", newQuantity);

            existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;

            const user = await User.findOne({ _id: existingStockTx.user_id });

            const existingWalletTx = await WalletTransaction.findOne({ _id: stockTxId });
            existingWalletTx.is_deleted = true;
            await existingWalletTx.save();

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

            console.log("OLD user.balance:", user.balance);
            console.log("Refund", refund);
            console.log("NEW user.balance:", newBalance);
            user.balance = newBalance;
            console.log("User balance updated.");

            // create new walletTx for partially fulfilled order  
            const newWalletTransaction = new WalletTransaction({
              user_id: existingStockTx.user_id,
              is_debit: false,
              amount: amountSpent,
              is_deleted: false
            });

            newStockTransaction.wallet_tx_id = newWalletTransaction._id
            newWalletTransaction.stock_tx_id = newStockTransaction._id

            await newStockTransaction.save();
            await newWalletTransaction.save();
            await existingPortfolioDocumentAndStockId.save();
            await existingStockTx.save();
            await stockUpdate.save();

            console.log("Transaction Complete: ", {
              existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId,
              newStockTransaction: newStockTransaction,
              newWalletTransaction: newWalletTransaction,
              existingStockTx: existingStockTx
            });
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
            const parentStockTx = await StockTransaction.findOne({ parent_stock_tx_id: stockTxId });
            if (parentStockTx)
            {
              existingStockTx.order_status = 'PARTIAL_FULFILLED';
            } else
            {
              existingStockTx.order_status = 'EXPIRED';
            };
          }

          const existingWalletTx = await WalletTransaction.findOne({ stock_tx_id: stockTxId });

          const user = await User.findOne({ _id: existingWalletTx.user_id });
          let newBalance = existingWalletTx.amount + user.balance;


          console.log("OLD user.balance:", user.balance)
          console.log("existingWalletTx.amount:", existingWalletTx.amount)
          console.log("NEW user.balance:", newBalance)

          user.balance = newBalance;

          existingStockTx.is_deleted = true;
          existingWalletTx.is_deleted = true;

          await existingStockTx.save();
          await existingWalletTx.save();
          await user.save();


          console.log("Execution Complete: ", {
            existingStockTx: existingStockTx,
            existingWalletTx: existingWalletTx,
            user: user
          });
          return;
        } catch (error)
        {
          console.error('Error returning amount spent to user balance:', error);
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
          const user = await User.findById(existingStockTx.user_id);

          let profit = existingStockTx.quantity * existingStockTx.stock_price;
          let newBalance = profit + user.balance;

          console.log("OLD user.balance:", user.balance);
          console.log("Profit", profit);
          console.log("NEW user.balance:", newBalance);

          user.balance = newBalance;
          console.log("User balance updated.");

          //create new wallet transaction - in stockTransaction wallet_tx_id field will be empty
          const newWalletTransaction = new WalletTransaction({
            user_id: existingStockTx.user_id,
            stock_tx_id: existingStockTx._id,
            is_debit: false,
            amount: profit,
            is_deleted: false
          });
          await newWalletTransaction.save();

          existingStockTx.wallet_tx_id = newWalletTransaction._id;

          await existingStockTx.save();
          await user.save();
          await stockUpdate.save();

          console.log("New Wallet Transaction added. ", {
            existingStockTx: existingStockTx,
            newWalletTransaction: newWalletTransaction,
            user: user
          });
          return;

        } catch (error)
        {
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
          const user = await User.findOne({ _id: existingStockTx.user_id });

          let profit = quantityStockInTransit * existingStockTx.stock_price;
          let newBalance = profit + user.balance;

          console.log("OLD user.balance:", user.balance);
          console.log("Profit", profit);
          console.log("NEW user.balance:", newBalance);

          user.balance = newBalance;
          console.log("User balance updated.");

          // add remaining stock quantity back to portfolio
          //let stocksToAddBack = existingStockTx.quantity - quantityStockInTransit;
          //let newStockQuantity = existingPortfolioDocumentAndStockId.quantity_owned + stocksToAddBack;
          //existingPortfolioDocumentAndStockId.quantity_owned = newStockQuantity;

          // find matched order stock transaction
          //const matchedTransaction = await StockTransaction.findById(matchedStockTxId);

          // new stockTx for partially fulfilled order
          const newStockTransaction = new StockTransaction({
            stock_id: existingStockTx.stock_id,
            user_id: existingStockTx.user_id,
            parent_stock_tx_id: stockTxId,
            portfolio_id: existingStockTx.portfolio_id,
            order_status: 'COMPLETED',
            is_buy: false,
            order_type: matchedTransaction.order_type,
            stock_price: existingStockTx.stock_price,
            quantity: quantityStockInTransit,
            is_deleted: false
          });

          // new walletTx for partially fulfilled order                    
          const newWalletTransaction = new WalletTransaction({
            user_id: existingStockTx.user_id,
            is_debit: false,
            amount: profit,
            is_deleted: false
          });

          newStockTransaction.wallet_tx_id = newWalletTransaction._id
          newWalletTransaction.stock_tx_id = newStockTransaction._id

          await newStockTransaction.save();
          await newWalletTransaction.save();
          await existingStockTx.save();

          await existingPortfolioDocumentAndStockId.save();
          await existingStockTx.save();
          await user.save();
          await stockUpdate.save();

          console.log("New Stock Transaction added.")
          console.log("New Wallet Transaction added.")
          return;

        } catch (error)
        {
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
            const parentStockTx = await StockTransaction.findOne({ parent_stock_tx_id: stockTxId });
            if (parentStockTx)
            {
              existingStockTx.order_status = 'PARTIAL_FULFILLED';
              //await existingStockTx.save();
            } else
            {
              existingStockTx.order_status = 'EXPIRED';
              //await existingStockTx.save();
            };
          }


          const childTransactions = await StockTransaction.find({ parent_stock_tx_id: stockTxId })
          let completedQuantity = existingStockTx.quantity;

          childTransactions.forEach(tx =>
          {
            if (tx.order_status === ORDER_STATUS.COMPLETED)
              completedQuantity -= tx.quantity;
          });


          // check if portfolio entry exists first and if not, make a new one \\ for the next submission
          let newQuantity = completedQuantity + existingPortfolioDocumentAndStockId.quantity_owned;

          console.log("OLD qunatity owned", existingPortfolioDocumentAndStockId.quantity_owned);
          console.log("Quantity received back", existingStockTx.quantity);
          console.log("NEW qunatity owned", newQuantity);

          existingPortfolioDocumentAndStockId.quantity_owned = newQuantity;
          // if the status is not PARTIAL_FULFILLED, then the stockTx is deleted
          if (existingStockTx.order_status !== 'PARTIAL_FULFILLED')
          {
            existingStockTx.is_deleted = true;
          }
          // existingStockTx.is_deleted = true;

          await existingPortfolioDocumentAndStockId.save();
          await existingStockTx.save();
          console.log("Execution Complete: ", {
            existingStockTx: existingStockTx,
            existingPortfolioDocumentAndStockId: existingPortfolioDocumentAndStockId,
          });
          return;

        } catch (error)
        {
          throw new Error('Error making changes to Portfolio:', error);
        }
      }
      console.log("Execution Complete: ", existingStockTx);
      return;
    }
  } catch (error)
  {
    throw new Error("Error fetching stock transaction", error);
  }
};
