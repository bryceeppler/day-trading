const StockTransaction = require('../models/stockTransactionModel');

// /getStockTransactions
async function getStockTransactions(req, res) {
    try {
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
    catch (error) {
        console.error('Error getting stock transactions:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}


// /getAllStockTransactions
async function getAllStockTransactions(req, res)
{

    try 
    {
        const stockTx = await StockTransaction.find({}).sort({ time_stamp: 1 }) || {};
        return res.status(200).json(stockTx);
    }
    catch (error) 
    {
        console.error('Error getting stock transactions:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}



module.exports = {
    getStockTransactions,
    getAllStockTransactions
};