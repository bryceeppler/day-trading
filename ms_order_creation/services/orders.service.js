const { handleError, createError } = require("../shared/lib/apiHandling");

const StockTransactionModel = require('../shared/models/stockTransactionModel');
const PortfolioModel = require('../shared/models/portfolioModel');
const WalletTransactionModel = require('../shared/models/walletTransactionModel');
const axios = require("../axios/base");
const config = require("../config/config");
const rabbitManager = require("../shared/config/rabbitmq");
const { MESSAGE_QUEUE, ORDER_STATUS } = require("../shared/lib/enums");

const redis =  require("../shared/config/redis");
const mongoDb = require("../shared/config/database");

mongoDb(config.mongodb)
redis.connect()


rabbitManager.connectToRabbitMQ(config.rabbitMQUrl);

exports.placeOrder = async (data, token) =>
{
  let previousBalance;
  let wallet_tx_id;
  let stock_tx_id;
  let portfolio_id;

  try
  {
   
		// Fetch User
    const userData = await redis.fetchUser(data.user_id);
    if (userData === null) throw handleError("Cannot find user", 400);
    // Check balance
    const balance = userData.balance;
    const stock = await redis.fetchStock(data.stock_id);
    let amount =
      data.price === null ? stock.current_price * data.quantity : data.price * data.quantity;
    if (balance < amount) throw createError("Insufficient Funds", 400);
    // Update Balance in database
		const updateUser = {...userData, balance: balance - amount}
    await redis.updateUser(updateUser);

    // Create portfolio if it doesnt exist
		const portfolio = await redis.fetchPortfolio(data.user_id, data.stock_id)
    if (!portfolio)
    {
      const newPortfolio = new PortfolioModel ({
        user_id: data.user_id,
        stock_id: data.stock_id,
        quantity_owned: 0,
      });
      await redis.createPortfolio(newPortfolio);
			portfolio_id = newPortfolio._id
    }

    previousBalance = balance;
    // Create a wallet transaction
    const walletTransactionData = new WalletTransactionModel ({
      user_id: data.user_id,
      is_debit: true,
      amount,
    });

    await redis.createWalletTransaction(
      walletTransactionData,
    );
		wallet_tx_id = walletTransactionData._id
    // Create a stock transaction
    const stockTxData = new StockTransactionModel ({
      user_id: data.user_id,
      wallet_tx_id: wallet_tx_id,
      stock_id: data.stock_id,
      is_buy: data.is_buy,
			order_status: ORDER_STATUS.IN_PROGRESS,
      order_type: data.order_type,
      stock_price: data.price ? data.price : stock.current_price,
      quantity: data.quantity,
      portfolio_id: portfolio_id ? portfolio_id : portfolio._id,
    });

   
    await redis.createStockTransaction(stockTxData);
		stock_tx_id = stockTxData._id

		walletTransactionData.stock_tx_id = stock_tx_id

    // Update stock tx id in wallet transaction.
    await redis.updateWalletTransaction(walletTransactionData);

    // Send data to matching engine
    const matchingEngineData = {
      ...data,
      price: data.price == null ? stock.current_price : data.price,
      wallet_tx_id,
      stock_tx_id,
    };

    await rabbitManager.publishToQueue(MESSAGE_QUEUE.PLACE_ORDER, matchingEngineData);

    // await axios.POST(
    //   `${config.mathingEngineUrl}/receiveOrder`,
    //   matchingEngineData,
    //   token,
    // );

  } catch (error)
  {
    console.error(error);
   /* const reverseError = await reversePlaceOrder(
      data.user_id,
      previousBalance,
      wallet_tx_id,
      stock_tx_id,
      portfolio_id,
    );
    if (reverseError)
    {
      return reverseError;
    }
    if (error.details)
    {
      return error.details.response.data.error;
    }
		*/
    throw createError("Error Placing Order");
  }
};

exports.sellOrder = async (data, token) =>
{
  let portfolio_id;
  let previousQuantityOwned;
  let stock_tx_id;
  try
  {
		console.log("-----------1----------------------")
    // Find Portfolio
		const portfolio = await redis.fetchPortfolio(data.user_id, data.stock_id)
		console.log("-----------2----------------------")
    if (!portfolio) throw createError("Portfolio not found");
    // Check for portfolio Quantity
    if (portfolio.quantity_owned < data.quantity)
      throw createError("Not enough owned stock", 400);

		portfolio_id = portfolio._id;
		previousQuantityOwned = portfolio.quantity_owned;
    // Update the quantity
		const updatePortfolio = {...portfolio, quantity_owned: portfolio.quantity_owned - data.quantity}

		console.log("-----------3----------------------")
		redis.updatePortfolio(updatePortfolio)

		console.log("-----------4----------------------")

 

    // Find stock
    const stock = await redis.fetchStock(data.stock_id);

		console.log("-----------5----------------------")
    //If no price, update price.
    if (!stock.starting_price)
    {
			const updatedStock = {...stock, starting_price: data.price, current_price: data.price}

		console.log("-----------6----------------------")
      await redis.updateStock(updatedStock);

		console.log("-----------6----------------------")
    }

    // Create a stock transaction
    const stockTxData = new StockTransactionModel({
      user_id: data.user_id,
      stock_id: data.stock_id,
      is_buy: data.is_buy,
			order_status: ORDER_STATUS.IN_PROGRESS,
      portfolio_id,
      order_type: data.order_type,
      stock_price: data.price ? data.price : stock.current_price,
      quantity: data.quantity,
    });

  
		console.log("-----------7---------------------")
    await redis.createStockTransaction(stockTxData);

		console.log("-----------8---------------------")
    stock_tx_id = stockTxData._id;

    const matchingEngineData = {
      ...data,
      price: data.price == null ? stock.current_price : data.price,
      stock_tx_id,
    };

    await rabbitManager.publishToQueue(MESSAGE_QUEUE.PLACE_ORDER, matchingEngineData);

    // // Send data to matching engine
    // await axios.POST(
    //   `${config.mathingEngineUrl}/receiveOrder`,
    //   matchingEngineData,
    //   token,
    // );
  } catch (error)
  {
		/*
    console.error(error);
    const reverseError = await reverseSellOrder(
      portfolio_id,
      previousQuantityOwned,
      stock_tx_id,
		//	data.user_id
    );
    if (reverseError)
    {
      return reverseError;
    }

    if (error.details)
    {
      return error.details.response.data.error;
    }
		*/
    throw createError("Error Selling Order");
  }
};

exports.cancelStockTransaction = async (data, token) =>
{
  try
  {
    await rabbitManager.publishToQueue(MESSAGE_QUEUE.CANCEL_ORDER, data);
    //await axios.POST(`${config.mathingEngineUrl}/cancelOrder`, data, token);
  } catch (error)
  {
    console.error(error);
		const status = error.response.status === 404 ? 200 : 500
    throw error.details ? error : createError("Error Selling Order", status);
  }
};

const reversePlaceOrder = async (
  userId,
  previousBalance,
  wallet_tx_id,
  stock_tx_id,
  portfolio_id,
) =>
{
  try
  {
    if (previousBalance !== undefined)
    {
      //await usersModel.updateBalance(userId, previousBalance);
    }

    if (wallet_tx_id)
    {
      //await ordersModel.deleteWalletTransaction(wallet_tx_id);
    }

    if (stock_tx_id)
    {
      //await ordersModel.deleteStockTransaction(stock_tx_id);
    }

    if (portfolio_id)
    {
      //await usersModel.deletePortfolio(portfolio_id);
    }
  } catch (error)
  {
    console.error(error);
    return createError("Error Placing Order - Reversing Data Failed");
  }
};

const reverseSellOrder = async (
  portfolioId,
  previousQuantityOwned,
  previousStockPrice,
  stock_tx_id,
	//user_id,
) =>
{
  try
  {
    if (previousQuantityOwned)
    {
      //await usersModel.updatePortfolioStockQuantity(
      //  portfolioId,
       // previousQuantityOwned,
				//user_id
      //);
    }

    if (stock_tx_id)
    {
     // await ordersModel.deleteStockTransaction(stock_tx_id);
    }
  } catch (error)
  {
    console.error(error);
    return createError("Error Selling Order - Reversing Data Failed");
  }
};
