const User = require('../models/User');
const StockTransaction = require('../models/stockTransactionModel');
const WalletTransaction = require('../models/walletTransactionModel');
const Stock = require('../models/stockModel');
const StockPortfolio = require('../models/portfolioModel');
const { STATUS_CODE } = require('../lib/enums');
const { handleError, successReturn, createError } = require('../lib/apiHandling');

const { authenticateToken } = require('../middleware/authenticateToken');

const express = require('express');
const router = express.Router();


async function getStockPortfolio(req, res, next) {
  try {
    // Assuming req.user is populated by the authenticateToken middleware
    const user = await User.findById(req.user.userId);
    if (!user) {
      return createError('User not found', STATUS_CODE.NOT_FOUND);
      
    }
    
    // Fetch stock portfolio for the user
    const portfolio = await StockPortfolio.find({ user: user._id });

    // Construct a dictionary to hold stock portfolio data
    const data = {};
    await Promise.all(portfolio.map(async portfolioItem => {
      const stock = await Stock.findById(portfolioItem.stock_id);
      data[portfolioItem.stock_id] = {
        stock_name: stock.stock_name,
        current_price: stock.current_price
      };
    }));

    return successReturn(res, data);
  } catch (error) {
    return handleError(error, res, next);
  }
}

// getWalletBalance
async function getWalletBalance(req, res, next) {
  try {
    // Assuming req.user is populated by the authenticateToken middleware
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw createError('User not found', STATUS_CODE.NOT_FOUND);
    }
    // Assuming the user model has a balance field
    const balance = user.balance;
    return successReturn(res, { balance });
  } catch (error) {
    return handleError(error, res, next);
  }
}

// addStockToUser
async function addStockToUser(req, res, next) {
  try {
    const { stock_id, quantity } = req.body;
    const userId = req.user.userId;

    // Validate request body parameters
    if (!stock_id || !quantity) {
      throw createError('Missing required parameters', STATUS_CODE.BAD_REQUEST);
    }

    // Check if there's an existing stock transaction for the user and stock
    let stockTransaction = await StockTransaction.findOne({ stock_id, userId });

    // If there's an existing transaction, update the quantity
    if (stockTransaction) {
      stockTransaction.quantity += quantity;
    } else {
      // If there's no existing transaction, create a new one
      stockTransaction = new StockTransaction({
        stock_id,
        wallet_tx_id: null,
        order_status: ORDER_STATUS.IN_PROGRESS,
        is_buy: false,
        order_type: null,
        stock_price: 0,
        quantity,
        is_deleted: false,
      });
    }

    // Save the updated or new stock transaction to the database
    await stockTransaction.save();
    
    return successReturn(res);
  } catch (error) {
    return handleError(error, res, next);
  }
}

// addMoneyToWallet
async function addMoneyToWallet(req, res, next) {
  try {
    const { amount } = req.body;

    // Validate request body parameters
    if (!amount) {
      throw createError('Missing required parameters', STATUS_CODE.BAD_REQUEST);
    }
    // Retrieve user's wallet transaction
    const walletTransaction = await User.findOne({ user_id: req.user.userId });

    // If the user doesn't have a wallet, you might want to handle this case appropriately
    if (!walletTransaction) {
      throw createError('User wallet not found', STATUS_CODE.NOT_FOUND);
    }

    // Update wallet balance
    walletTransaction.balance += amount;

    // Save the updated wallet transaction to the database
    await walletTransaction.save();

    return successReturn(res);
  } catch (error) {
    return handleError(error, res, next);
  } 
}

// Define the routes and use the authenticateToken middleware
router.get('/getStockPortfolio', authenticateToken, getStockPortfolio);
router.get('/getWalletBalance', authenticateToken, getWalletBalance);
router.post('/addStockToUser', authenticateToken, addStockToUser);
router.post('/addMoneyToWallet', authenticateToken, addMoneyToWallet);

module.exports = router;