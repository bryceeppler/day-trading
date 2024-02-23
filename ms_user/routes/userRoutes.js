const User = require('../shared/models/userModel');
const StockTransaction = require('../models/stockTransactionModel');
const WalletTransaction = require('../models/walletTransactionModel');
const Stock = require('../models/stockModel');
const StockPortfolio = require('../models/portfolioModel');
const { STATUS_CODE } = require('../lib/enums');
const { handleError, successReturn, createError } = require('../lib/apiHandling');

const { authenticateToken } = require('../middleware/authenticateToken');

const express = require('express');
const router = express.Router();


async function getStockPortfolio(req, res, next)
{
  try
  {
    // Assuming req.user is populated by the authenticateToken middleware
    const user = await User.findById(req.user.userId);
    if (!user)
    {
      return createError('User not found', STATUS_CODE.NOT_FOUND);
    }

    // Fetch stock portfolio for the user
    const portfolio = await StockPortfolio.find({ user_id: user._id, quantity_owned: { $gt: 0 } });

    // create a list to hold the stock portfolio data
    const data = []
    await Promise.all(portfolio.map(async portfolioItem =>
    {
      const stock = await Stock.findById(portfolioItem.stock_id);
      if (!stock)
      {
        throw createError('Stock not found', STATUS_CODE.NOT_FOUND);
      }
      if (portfolioItem.quantity_owned) {
      data.push({
        stock_id: portfolioItem.stock_id,
        stock_name: stock.stock_name,
        quantity_owned: portfolioItem.quantity_owned
      });
    }
    }));
    return successReturn(res, data);
  } catch (error)
  {
    return handleError(error, res, next);
  }
}

// getWalletBalance
async function getWalletBalance(req, res, next)
{
  try
  {
    // Assuming req.user is populated by the authenticateToken middleware
    const user = await User.findById(req.user.userId);
    if (!user)
    {
      throw createError('User not found', STATUS_CODE.NOT_FOUND);
    }
    // Assuming the user model has a balance field
    const balance = user.balance;
    return successReturn(res, { balance });
  } catch (error)
  {
    return handleError(error, res, next);
  }
}

// addStockToUser
async function addStockToUser(req, res, next)
{
  try
  {
    const { stock_id, quantity } = req.body;
    const userId = req.user.userId;

    // Validate request body parameters
    if (!stock_id || !quantity)
    {
      throw createError('Missing required parameters', STATUS_CODE.BAD_REQUEST);
    }


    // get the user portfolio
    const portfolio = await StockPortfolio.find({ user_id: userId });


    // check if the user already has some of the stock
    const stock = portfolio.find((portfolioItem) => portfolioItem.stock_id === stock_id);

    // if it's already there, update the quantity
    if (stock)
    {
      stock.quantity_owned += quantity;
      await stock.save();
      return successReturn(res);
    }
    // if it's not there, create a new portfolio item
    const newStock = new StockPortfolio({
      user_id: userId,
      stock_id,
      quantity_owned: quantity
    });

    // save the new portfolio item
    await newStock.save();

    // optionally create a record of this transaction

    return successReturn(res);
  } catch (error)
  {
    return handleError(error, res, next);
  }
}

// addMoneyToWallet
async function addMoneyToWallet(req, res, next)
{
  try
  {
    const { amount } = req.body;
    // Validate request body parameters
    if (!amount || amount < 0)
    {
      throw createError('Missing required parameters', STATUS_CODE.BAD_REQUEST);
    }
    // Retrieve user's wallet transaction
    const user = await User.findOne({ _id: req.user.userId });

    if (!user) {
      console.log("No User")
      return createError('User not found', STATUS_CODE.NOT_FOUND);
    }

    // Update wallet balance
    user.balance += amount;

    // Save the updated wallet transaction to the database
    await user.save();

    return successReturn(res);
  } catch (error) {
    console.log("Error adding to wallet", error)
    return handleError(error, res, next);
  }
}

// Define the routes and use the authenticateToken middleware
router.get('/getStockPortfolio', authenticateToken, getStockPortfolio);
router.get('/getWalletBalance', authenticateToken, getWalletBalance);
router.post('/addStockToUser', authenticateToken, addStockToUser);
router.post('/addMoneyToWallet', authenticateToken, addMoneyToWallet);

module.exports = router;
