const { handleError, createError } = require("../shared/lib/apiHandling");
const ordersModel = require("../models/orders.model");
const usersModel = require("../models/users.model");
const axios = require("../axios/base");
const config = require("../config/config");
const rabbitManager = require("../shared/config/rabbitmq");
const { MESSAGE_QUEUE } = require("../shared/lib/enums");


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
    const userData = await usersModel.fetchBalance(data.user_id);
    if (userData === null) throw handleError("Cannot find user", 400);
    // Check balance
    const balance = userData.balance;
    const stock = await ordersModel.fetchStock(data.stock_id);
    let amount =
      data.price === null ? stock.current_price * data.quantity : data.price * data.quantity;
    if (balance < amount) throw createError("Insufficient Funds", 400);
    // Update Balance in database
    await usersModel.updateBalance(data.user_id, balance - amount);

    // Create portfolio if it doesnt exist
    const portfolio = await usersModel.fetchPortfolio({
      stockId: data.stock_id,
      userId: data.user_id,
    });
    if (!portfolio)
    {
      const newPortfolio = {
        user_id: data.user_id,
        stock_id: data.stock_id,
        quantity_owned: 0,
      };
      const newInsert = await usersModel.createPortfolio(newPortfolio);
      portfolio_id = newInsert._id;
    }

    previousBalance = balance;
    // Create a wallet transaction
    const walletTransactionData = {
      user_id: data.user_id,
      is_debit: true,
      amount,
    };
    const createdWalletTx = await ordersModel.createWalletTransaction(
      walletTransactionData,
    );
    wallet_tx_id = createdWalletTx._id;

    // Create a stock transaction
    const stockTxData = {
      user_id: data.user_id,
      wallet_tx_id: wallet_tx_id,
      stock_id: data.stock_id,
      is_buy: data.is_buy,
      order_type: data.order_type,
      stock_price: data.price ? data.price : stock.current_price,
      quantity: data.quantity,
      portfolio_id: portfolio_id ? portfolio_id : portfolio.id,
    };

    const createdStockTx =
      await ordersModel.createStockTransaction(stockTxData);
    stock_tx_id = createdStockTx._id;

    // Update stock tx id in wallet transaction.
    await ordersModel.updateStockTxId(createdWalletTx._id, stock_tx_id);

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
    const reverseError = await reversePlaceOrder(
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
    // Find Portfolio
    const portfolio = await usersModel.fetchPortfolio({
      stockId: data.stock_id,
      userId: data.user_id,
    });
    if (!portfolio) throw createError("Portfolio not found");
    // Check for portfolio Quantity
    if (portfolio.quantity_owned < data.quantity)
      throw createError("Not enough owned stock", 400);

    // Update the quantity
    await usersModel.updatePortfolioStockQuantity(
      portfolio._id,
      portfolio.quantity_owned - data.quantity,
    );
    portfolio_id = portfolio._id;
    previousQuantityOwned = portfolio.quantity_owned;

    // Find stock
    const stock = await ordersModel.fetchStock(data.stock_id);

    //If no price, update price.
    if (!stock.starting_price)
    {
      await ordersModel.updateStockPrice(data.stock_id, data.price);
    }

    // Create a stock transaction
    const stockTxData = {
      user_id: data.user_id,
      stock_id: data.stock_id,
      is_buy: data.is_buy,
      portfolio_id,
      order_type: data.order_type,
      stock_price: data.price ? data.price : stock.current_price,
      quantity: data.quantity,
    };

    const createdStockTx =
      await ordersModel.createStockTransaction(stockTxData);
    stock_tx_id = createdStockTx._id;

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
    console.error(error);
    const reverseError = await reverseSellOrder(
      portfolio_id,
      previousQuantityOwned,
      stock_tx_id,
    );
    if (reverseError)
    {
      return reverseError;
    }

    if (error.details)
    {
      return error.details.response.data.error;
    }
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

    throw error.details ? error : createError("Error Selling Order");
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
      await usersModel.updateBalance(userId, previousBalance);
    }

    if (wallet_tx_id)
    {
      await ordersModel.deleteWalletTransaction(wallet_tx_id);
    }

    if (stock_tx_id)
    {
      await ordersModel.deleteStockTransaction(stock_tx_id);
    }

    if (portfolio_id)
    {
      await usersModel.deletePortfolio(portfolio_id);
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
) =>
{
  try
  {
    if (previousQuantityOwned)
    {
      await usersModel.updatePortfolioStockQuantity(
        portfolioId,
        previousQuantityOwned,
      );
    }

    if (stock_tx_id)
    {
      await ordersModel.deleteStockTransaction(stock_tx_id);
    }
  } catch (error)
  {
    console.error(error);
    return createError("Error Selling Order - Reversing Data Failed");
  }
};
