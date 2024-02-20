const User = require('../models/User');
const StockTransaction = require('../models/stockTransactionModel');
//const stockTransactionController = require('../controllers/stockTransactionController');
const WalletTransaction = require('../models/walletTransactionModel');
//const walletTransactionController = require('../controllers/walletTransactionController');

const { authenticateToken } = require('../middleware/authenticateToken');

const express = require('express');
const router = express.Router();

// getStockPortfolio
async function getStockPortfolio(req, res) {
  try {
      // Assuming req.user is populated by the authenticateToken middleware
      const user = await User.findById(req.user.userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }
      
      // Fetch user's actual stock portfolio from the database
      const stocks = await StockTransaction.find({ user: user._id });

      // Return the user's stock portfolio
      return res.status(200).json({ success: true, data: stocks });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// getWalletBalance
async function getWalletBalance(req, res) {
    try {
      // Assuming req.user is populated by the authenticateToken middleware
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      // Assuming the user model has a balance field
      const balance = user.balance;
      return res.status(200).json({ success: true, data: { balance } });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
}

// getStockTransactions
async function getStockTransactions(req, res, next) {
  try {
      // Assuming req.user is populated by the authenticateToken middleware
      const user = await User.findById(req.user.userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found" });
      }

      // Fetch user's actual stock transactions from the database
      const stockTransactions = await StockTransaction.find({ user: user._id, is_deleted: false }).sort({ time_stamp: 1 });

      // Transform stock transactions
      const transformedStockTransactions = stockTransactions.map(tx => ({
          stock_tx_id: tx._id,
          stock_id: tx.stock_id,
          wallet_tx_id: tx.wallet_tx_id,
          order_status: tx.order_status,
          is_buy: tx.is_buy,
          order_type: tx.order_type,
          stock_price: tx.stock_price,
          quantity: tx.quantity,
          time_stamp: tx.time_stamp,
      }));

      // Return the transformed data
      return res.status(200).json({ success: true, data: transformedStockTransactions });
  } catch (error) {
      console.error('Error getting stock transactions:', error);
      return res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
  }
}

// Define the routes and use the authenticateToken middleware
router.get('/getStockPortfolio', authenticateToken, getStockPortfolio);
router.get('/getWalletBalance', authenticateToken, getWalletBalance);
router.get('/getStockTransactions', authenticateToken, getStockTransactions);

module.exports = router;