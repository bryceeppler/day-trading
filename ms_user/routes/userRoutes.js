const User = require('../models/User');
const StockTransaction = require('../models/stockTransactionModel');
const stockTransactionController = require('../controllers/stockTransactionController');
const WalletTransaction = require('../models/walletTransactionModel');
const walletTransactionController = require('../controllers/walletTransactionController');

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

// addStockToUser
async function addStockToUser(req, res) {
  try {
    const { stock_id, quantity } = req.body;

    // Validate request body parameters
    if (!stock_id || !quantity) {
      return res.status(400).json({ success: false, data: null, message: "Missing required parameters" });
    }

    // Add logic to add stock to user (e.g., save to database)

    return res.status(200).json({ success: true, data: null});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
}

// addMoneyToWallet
async function addMoneyToWallet(req, res) {
  try {
    const { amount } = req.body;

    // Validate request body parameters
    if (!amount) {
      return res.status(400).json({ success: false, data: null, message: "Missing required parameters" });
    }

    // Add logic to add money to user's wallet (e.g., save to database)

    return res.status(200).json({ success: true, data: null});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, data: null, message: 'Server error' });
  } 
}

// Define the routes and use the authenticateToken middleware
router.get('/getStockPortfolio', authenticateToken, getStockPortfolio);
router.get('/getWalletBalance', authenticateToken, getWalletBalance);
router.post('/addStockToUser', authenticateToken, addStockToUser);
router.post('/addMoneyToWallet', authenticateToken, addMoneyToWallet);

module.exports = router;