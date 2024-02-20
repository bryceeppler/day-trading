const User = require('../models/User');
const { authenticateToken } = require('../middleware/authenticateToken');

const express = require('express');
const router = express.Router();

//getStockPrices
async function getStockPrices(req, res) {
    try {
      // Assuming req.user is populated by the authenticateToken middleware
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      // Assuming the user model has a balance field
      const balance = user.balance;
      return res.status(200).json({ success: true, data:[{ stock_id, stock_name, current_price }, {stock_id, stock_name, current_price}] });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
}

// //getWalletBalance
// async function getWalletBalance(req, res) {
//     try {
//       // Assuming req.user is populated by the authenticateToken middleware
//       const user = await User.findById(req.user.userId);
//       if (!user) {
//         return res.status(404).json({ success: false, message: "User not found" });
//       }
//       // Assuming the user model has a balance field
//       const balance = user.balance;
//       return res.status(200).json({ success: true, data: { balance } });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ success: false, message: 'Server error' });
//     }
// }

//getWalletBalance
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

// Define the route and use the authenticateToken middleware
// router.get('/getStockPrices', authenticateToken, getStockPrices);
router.get('/getWalletBalance', authenticateToken, getWalletBalance);


module.exports = router;