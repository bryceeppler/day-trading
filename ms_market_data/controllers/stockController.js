const Stock = require('../shared/models/stockModel');
const { createError, handleError, successReturn } = require('../shared/lib/apiHandling');
const { STATUS_CODE } = require('../shared/lib/enums');

exports.createStock = async (req, res) =>
{
    try
    {
        const { stock_name } = req.body;
        // check if the stock name already exists in db
        const existingStock = await Stock.findOne({ stock_name });
        
        if (existingStock) handleError(createError("stock already exists", 400), res, next);

        // generate a random initial price in the range of $20.00 - $80.00.
        const startingPrice = Math.random() * (80 - 20) + 20;

        const newStock = new Stock({ stock_name, starting_price: startingPrice, current_price: startingPrice })
        newStock.save();

        successReturn(res, STATUS_CODE.CREATED, newStock);
    } catch (error)
    {
        handleError(error, res, next);
    }
}

// /getStockPrices
exports.getStockPrices = async (req, res) => 
{
    try 
    {
        const stocks = await Stock.find({}, 'stock_name current_price') || {};

        // Map the documents and rename _id to stock_id
        const transformedStocks = stocks.map(stock => ({
            stock_id: stock._id,
            stock_name: stock.stock_name,
            current_price: stock.current_price,
        }));
        successReturn(res, transformedStocks);
    }
    catch (error) 
    {
        handleError(error, res, next);
    }
}

// /getAllStocks
exports.getAllStocks = async (req, res) => 
{
    try 
    {
        const stocks = await Stock.find() || {};
        successReturn(res, stocks);
    }
    catch (error) 
    {
        handleError(error, res, next);
    }
}

// /updateStockPrice/:stockId
exports.updateStockPrice = async (req, res) =>
{
    try
    {
        const stockId = req.params.stock_id;
        const { new_price } = req.body;

        // Check if the stock exists
        const existingStock = await Stock.findById(stockId);

        if (!existingStock) handleError(createError('Stock not found', 400), res, next);

        existingStock.current_price = new_price;
        await existingStock.save();

        successReturn(res, existingStock);
    }
    catch (error)
    {
        handleError(error, res, next);
    }
}