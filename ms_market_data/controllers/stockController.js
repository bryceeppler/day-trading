const Stock = require('../models/stockModel');


async function createStock(req, res)
{
    try
    {
        const { stock_name } = req.body;
        // check if the stock name already exists in db
        const existingStock = await Stock.findOne({ stock_name });
        if (existingStock)
        {
            return res.status(400).json({ message: "Stock already exists" });
        }

        // generate a random initial price in the range of $20.00 - $80.00.
        const startingPrice = Math.random() * (80 - 20) + 20;

        const newStock = new Stock({ stock_name, starting_price: startingPrice, current_price: startingPrice })
        newStock.save();

        return res.status(201).json(newStock);
    } catch (error)
    {
        console.error('Error creating stock:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getStockPrices
async function getStockPrices(req, res) 
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

        return res.status(200).json(transformedStocks);
    }
    catch (error) 
    {
        console.error('Error getting stock prices:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getAllStocks
async function getAllStocks(req, res) 
{
    try 
    {
        const stocks = await Stock.find() || {};
        return res.status(200).json(stocks);
    }
    catch (error) 
    {
        console.error('Error getting stock prices:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /updateStockPrice/:stockId
async function updateStockPrice(req, res)
{
    try
    {
        const stockId = req.params.stock_id;
        const { new_price } = req.body;

        // Check if the stock exists
        const existingStock = await Stock.findById(stockId);

        if (!existingStock)
        {
            return res.status(404).json({ message: 'Stock not found' });
        }

        existingStock.current_price = new_price;
        await existingStock.save();

        return res.status(200).json(existingStock);
    }
    catch (error)
    {
        console.error('Error updating stock price:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

module.exports = {
    createStock,
    getStockPrices,
    getAllStocks,
    updateStockPrice
};