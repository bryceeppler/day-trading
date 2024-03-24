const express = require('express');
const { getStockTransactions, getAllStockTransactions } = require('../controllers/stockTransactionController');
const { getWalletTransactions, getAllWalletTransactions } = require('../controllers/walletTransactionController');
const router = express.Router();

//get(getWalletBalance);
/**
 * @swagger
 * paths:
 *   /getWalletTransactions:
 *     get:
 *       summary: Retrieve all active wallet transactions (excludes deleted transactions)
 */
router.route('/getWalletTransactions').get(getWalletTransactions);

/**
 * @swagger
 * paths:
 *   /getAllWalletTransactions:
 *     get:
 *       summary: Retrieve all wallet transactions (includes deleted transactions)
 */
router.route('/getAllWalletTransactions').get(getAllWalletTransactions);

/**
 * @swagger
 * paths:
 *   /getAllStockTransactions:
 *     get:
 *       summary: Retrieve all stock transactions (includes deleted transactions)
 */
router.route('/getStockTransactions').get(getStockTransactions);
/**
 * @swagger
 * paths:
 *   /getStockTransactions:
 *     get:
 *       summary: Retrieve all active stock transactions (excludes deleted transactions)
 */
router.route('/getAllStockTransactions').get(getAllStockTransactions);

/**
 * @swagger
 * paths:
 *   /createStockTransaction:
 *     post:
 *       summary: Create a new stock transaction
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stock_id:
 *                   type: string
 *                   description: The ID of the stock associated with the transaction.
 *                 wallet_tx_id:
 *                   type: string
 *                   description: The ID of the wallet transaction.
 *                 is_buy:
 *                   type: boolean
 *                   description: Indicates whether the transaction is a buy order.
 *                 order_type:
 *                   type: string
 *                   description: The type of the order (e.g., "market", "limit").
 *                 stock_price:
 *                   type: number
 *                   description: The price of the stock in the transaction.
 *                 quantity:
 *                   type: number
 *                   description: The quantity of stocks in the transaction.
 *               required:
 *                 - stock_id
 *                 - wallet_tx_id
 *                 - is_buy
 *                 - order_type
 *                 - stock_price
 *                 - quantity
 */

module.exports = router;

