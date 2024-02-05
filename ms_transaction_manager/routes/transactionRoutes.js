const express = require('express');
const { createStockTx, updateStockTxStatus, deleteStockTx, getStockTransactions } = require('../controllers/stockTransactionController');
const { createWalletTx, updateStockTxId, deleteWalletTx, getWalletTransactions } = require('../controllers/walletTransactionController');
const walletTxValidation = require('./validations/walletTxValidation')
const stockTxValidation = require('./validations/stockTxValidation')
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get information about the Audit Manager Microservice
 *     description: Returns a message indicating that it is the audit manager microservice.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: This is the audit manager microservice
 */
router.route('/').get((req, res) =>
{
    res.send("This is the audit manager microservice");
});

router.route('/getWalletTransactions').get(getWalletTransactions);
router.route('/getStockTransactions').get(getStockTransactions);

router.route('/createWalletTransaction').post([walletTxValidation.createWalletTxValidation], createWalletTx);
router.route('/createStockTransaction').post([stockTxValidation.createStockTxValidation], createStockTx);

router.route('/updateStockTxStatus').put([stockTxValidation.updateStockTxStatusValidation], updateStockTxStatus);
router.route('/updateStockTxId').put([walletTxValidation.updateStockTxValidation], updateStockTxId)

router.route('/deleteStockTransaction').put([stockTxValidation.deleteStockTxValidation], deleteStockTx)
router.route('/deleteWalletTransaction').put([walletTxValidation.deleteWAlletTxValidation], deleteWalletTx);



module.exports = router;

