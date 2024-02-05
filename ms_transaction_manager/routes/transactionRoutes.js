const express = require('express');
const { createStockTx, updateStockTxStatus, deleteStockTx, getStockTransactions, getAllStockTransactions } = require('../controllers/stockTransactionController');
const { createWalletTx, updateStockTxId, deleteWalletTx, getWalletTransactions, getAllWalletTransactions } = require('../controllers/walletTransactionController');
const walletTxValidation = require('./validations/walletTxValidation')
const stockTxValidation = require('./validations/stockTxValidation')
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get information about the Transaction Manager Microservice
 *     description: Returns a message indicating that it is the transaction manager microservice.
 */
router.route('/').get((req, res) =>
{
    res.send("This is the audit manager microservice");
});

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
 *       summary: Retrieve all active stock transactions (excludes deleted transactions)
 */
router.route('/getStockTransactions').get(getStockTransactions);
/**
 * @swagger
 * paths:
 *   /getStockTransactions:
 *     get:
 *       summary: Retrieve all active stock transactions (includes deleted transactions)
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
router.route('/createStockTransaction')
    .post(
        [stockTxValidation.createStockTxValidation],
        createStockTx
    );

/**
 * @swagger
 * /createWalletTransaction:
 post:
      summary: Create a new wallet transaction
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                is_debit:
                  type: boolean
                  description: Indicates whether the transaction is a debit.
                amount:
                  type: number
                  description: The transaction amount.
              required:
                - is_debit
                - amount
 */
router.route('/createWalletTransaction')
    .post(
        [walletTxValidation.createWalletTxValidation],
        createWalletTx
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
router.route('/updateStockTxStatus').
    put(
        [stockTxValidation.updateStockTxStatusValidation],
        updateStockTxStatus);

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
router.route('/updateStockTxId').
    put(
        [walletTxValidation.updateWalletTxValidation],
        updateStockTxId)

/**
 * @swagger
 * paths:
 *   /deleteStockTx/{stock_tx_id}:
 *     delete:
 *       summary: Delete a stock transaction
 *       parameters:
 *         - in: path
 *           name: stock_tx_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the stock transaction to delete.
 */
router.route('/deleteStockTransaction')
    .put(
        [stockTxValidation.deleteStockTxValidation],
        deleteStockTx);


/**
 * @swagger
 * paths:
 *   /deleteWalletTx/{wallet_tx_id}:
 *     delete:
 *       summary: Delete a wallet transaction
 *       parameters:
 *         - in: path
 *           name: wallet_tx_id
 *           required: true
 *           schema:
 *             type: string
 *           description: The ID of the wallet transaction to delete.
 */

router.route('/deleteWalletTransaction')
    .put(
        [walletTxValidation.deleteWalletTxValidation],
        deleteWalletTx
    );



module.exports = router;

