const express = require('express');
const { createStock, getStockPrices, getAllStocks, updateStockPrice } = require('../controllers/stockController');
const validation = require('./validations/stockValidation')
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get information about the market data microservice
 *     description: Retrieve information about the market data microservice.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: This is the market data microservice
 */
router.route('/').get((req, res) =>
{
    res.send("This is the market data microservice");
});

/**
 * @swagger
 * /getStockPrices:
 *   get:
 *     summary: Get stock prices
 *     description: Retrieve the current prices of all stocks.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - stock_name: Google
 *                 current_price: 50.23
 *               - stock_name: Meta
 *                 current_price: 75.65
 */
router.route('/getstockprices').get(getStockPrices);

/**
 * @swagger
 * /getAllStocks:
 *   get:
 *     summary: Get all stocks
 *     description: Retrieve information about all stocks.
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - stock_name: Google
 *                 current_price: 50.23
 *               - stock_name: Meta
 *                 current_price: 75.65
 */
router.route('/getallstocks').get(getAllStocks);

/**
 * @swagger
 * /createStock:
 *   post:
 *     summary: Create a new stock
 *     description: Create a new stock with a random initial price in the range of $20.00 - $80.00.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock_name:
 *                 type: string
 *                 description: The name of the new stock.
 *             required:
 *               - stock_name
 */
router.route('/createstock').post([validation.createStockValidation], createStock);

/**
 * @swagger
 * /updateStockPrice/{stock_id}:
 *   put:
 *     summary: Update stock price
 *     description: Update the current price of a specific stock.
 *     parameters:
 *       - in: path
 *         name: stock_id
 *         schema:
 *           type: string
 *         description: The ID of the stock to update.
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               new_price:
 *                 type: number
 *                 description: The new price of the stock.
 *             required:
 *               - new_price
 */
router.route('/updatestockprice/:stock_id').put([validation.updateStockPriceValidation], updateStockPrice);

module.exports = router;

