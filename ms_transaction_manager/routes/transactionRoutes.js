const express = require('express');
const stockTxController = require('../controllers/stockTransactionController');
const walletTxController = require('../controllers/walletTransactionController');
const walletTxValidation = require('./validations/walletTxValidation')
const stockTxValidation = require('./validations/stockTxValidation')
const router = express.Router();

const { authenticateToken } = require('../shared/middleware/authentication');
const acccessToken = process.env.JWT_SECRET;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get information about the Transaction Manager Microservice
 *     description: Returns a message indicating that it is the transaction manager microservice.
 */
router.route('/').get((req, res) =>
{
    res.send("This is the transaction manager microservice");
});

/**
 * @swagger
 * paths:
 *   /getWalletTransactions:
 *     get:
 *       summary: Retrieve all active wallet transactions (excludes deleted transactions)
 */
router.route('/getWalletTransactions').get(authenticateToken(acccessToken), walletTxController.getWalletTransactions);

/**
 * @swagger
 * paths:
 *   /getAllWalletTransactions:
 *     get:
 *       summary: Retrieve all wallet transactions (includes deleted transactions)
 */
router.route('/getAllWalletTransactions').get(walletTxController.getAllWalletTransactions);

/**
 * @swagger
 * paths:
 *   /getAllStockTransactions:
 *     get:
 *       summary: Retrieve all stock transactions (includes deleted transactions)
 */
router.route('/getStockTransactions').get(authenticateToken(acccessToken), stockTxController.getStockTransactions);
/**
 * @swagger
 * paths:
 *   /getStockTransactions:
 *     get:
 *       summary: Retrieve all active stock transactions (excludes deleted transactions)
 */
router.route('/getAllStockTransactions').get(stockTxController.getAllStockTransactions);

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
router.route('/createStockTransaction')
    .post(
        [stockTxValidation.createStockTxValidation],
        stockTxController.createStockTx
    );

/**
 * @swagger
 * paths:
 *   /createWalletTransaction:
 *     post:
 *       summary: Create a new wallet transaction
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_debit:
 *                   type: boolean
 *                   description: Indicates whether the transaction is a debit.
 *                 amount:
 *                   type: number
 *                   description: The amount of the transaction.
 *               required:
 *                 - is_debit
 *                 - amount
 */

router.route('/createWalletTransaction')
    .post(
        [walletTxValidation.createWalletTxValidation],
        walletTxController.createWalletTx
    );

/**
 * @swagger
 * paths:
 *   /updateStockTxStatus/{stock_tx_id}:
 *     put:
 *       summary: Update the status of a stock transaction
 *       parameters:
 *         - in: path
 *           name: stock_tx_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the stock transaction to update.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_status:
 *                   type: string
 *                   description: The updated status of the stock transaction.
 *               required:
 *                 - order_status
 */
router.route('/updateStockTxStatus/:stock_tx_id').
    put(
        [stockTxValidation.updateStockTxStatusValidation],
        stockTxController.updateStockTxStatus);

/**
 * @swagger
 * paths:
 *  /updateStockTxId/{wallet_tx_id}:
 *     put:
 *       summary: Update stock transaction ID for a wallet transaction
 *       parameters:
 *         - in: path
 *           name: wallet_tx_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the wallet transaction to update.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 stock_tx_id:
 *                   type: string
 *                   description: The ID of the associated stock transaction.
 *               required:
 *                 - stock_tx_id
 */
router.route('/updateStockTxId/:wallet_tx_id').
    put(
        [walletTxValidation.updateWalletTxValidation],
        walletTxController.updateStockTxId)

/**
 * @swagger
 * paths:
 *   /deleteStockTransaction/{stock_tx_id}:
 *     put:
 *       summary: Delete a stock transaction
 *       parameters:
 *         - in: path
 *           name: stock_tx_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the stock transaction to delete.
 */
router.route('/deleteStockTransaction/:stock_tx_id')
    .put(
        [stockTxValidation.deleteStockTxValidation],
        stockTxController.deleteStockTx);


/**
 * @swagger
 * paths:
 *   /deleteWalletTransaction/{wallet_tx_id}:
 *     put:
 *       summary: Delete a wallet transaction
 *       parameters:
 *         - in: path
 *           name: wallet_tx_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the wallet transaction to delete.
 */

router.route('/deleteWalletTransaction/:wallet_tx_id')
    .put(
        [walletTxValidation.deleteWalletTxValidation],
        walletTxController.deleteWalletTx
    );



module.exports = router;

