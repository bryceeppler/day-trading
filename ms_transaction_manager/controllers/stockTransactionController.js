const StockTransaction = require('../models/stockTransactionModel');

// /createWalletTransaction
async function createStockTx(req, res)
{
    try
    {
        const { stock_id, wallet_tx_id, is_buy, order_type, stock_price, quantity } = req.body;

        const newStockTx = new StockTransaction({
            stock_id,
            wallet_tx_id,
            is_buy,
            order_type,
            stock_price,
            quantity,
        })
        newStockTx.save();

        return res.status(201).json(newStockTx);
    } catch (error)
    {
        console.error('Error creating wallet transaciton:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /updateStockTxStatus/:stockTxId
async function updateStockTxStatus(req, res)
{
    try
    {
        const stockTxId = req.params.stock_tx_id;
        const { order_status } = req.body;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.findById(stockTxId);

        if (!existingStockTx)
        {
            return res.status(404).json({ message: 'Stock Transaction not found' });
        }

        existingStockTx.order_status = order_status;
        await existingStockTx.save();

        return res.status(200).json(existingStockTx);
    }
    catch (error)
    {
        console.error('Error updating stock price:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /deleteStockTx/:StockTxId
async function deleteStockTx(req, res)
{
    try
    {
        const stockTxId = req.params.stock_tx_id;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.findById(stockTxId);

        if (!existingStockTx)
        {
            return res.status(404).json({ message: 'Wallet Transaction not found' });
        }
        // update is_deleted flag
        existingStockTx.is_deleted = true;
        await existingStockTx.save();

        return res.status(200).json(existingStockTx);
    }
    catch (error)
    {
        console.error('Error updating stock price:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getStockTransactions
async function getStockTransactions(req, res)
{

    try 
    {
        // get all stock transaction that are not deleted.  
        const stockTx = await StockTransaction.find({ is_deleted: false }).sort({ time_stamp: 1 }) || {};

        // Map the documents and rename _id to stock_tx_id
        const transformedStockTx = stockTx.map(tx => ({
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
        return res.status(200).json(transformedStockTx);
    }
    catch (error) 
    {
        console.error('Error getting stock prices:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}


// /getStockTransactions
async function getAllStockTransactions(req, res)
{

    try 
    {
        const stockTx = await StockTransaction.find().sort({ time_stamp: 1 }) || {};

        // Map the documents and rename _id to stock_tx_id
        const transformedStockTx = stockTx.map(tx => ({
            stock_tx_id: tx._id,
            stock_id: tx.stock_id,
            wallet_tx_id: tx.wallet_tx_id,
            order_status: tx.order_status,
            is_buy: tx.is_buy,
            order_type: tx.order_type,
            stock_price: tx.stock_price,
            quantity: tx.quantity,
            time_stamp: tx.time_stamp,
            is_deleted: tx.is_deleted
        }));
        return res.status(200).json(transformedStockTx);
    }
    catch (error) 
    {
        console.error('Error getting stock prices:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

module.exports = {
    createStockTx,
    updateStockTxStatus,
    deleteStockTx,
    getStockTransactions,
    getAllStockTransactions
};