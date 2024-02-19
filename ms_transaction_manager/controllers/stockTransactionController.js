const { successReturn } = require('../../ms_shared/lib/apiHandling');
const StockTransaction = require('../shared/models/stockTransactionModel');

// /createWalletTransaction
exports.createStockTx = async (req, res) =>
{
    try
    {
        const { stock_id, 
                wallet_tx_id, 
                portfolio_id, 
                is_buy, 
                order_type, 
                stock_price, 
                quantity } = req.body;

        const newStockTx = new StockTransaction({
            stock_id,
            wallet_tx_id,
            portfolio_id,
            is_buy,
            order_type,
            stock_price,
            quantity,
        });
        
        newStockTx.save();

        successReturn(res, newStockTx);
    } catch (error)
    {
        handleError(error, res, next);
        console.error('Error creating stock transaciton:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /updateStockTxStatus/:stockTxId
exports.updateStockTxStatus = async (req, res) =>
{
    try
    {
        const stockTxId = req.params.stock_tx_id;
        const { order_status } = req.body;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.findById(stockTxId);

        if (!existingStockTx) handleError(createError('Stock transaction not found', 400));

        existingStockTx.order_status = order_status;
        await existingStockTx.save();

        successReturn(res, existingStockTx);
    }
    catch (error)
    {
        handleError(error, res, next);
        console.error('Error updating stock transaction', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /deleteStockTx/:StockTxId
exports.deleteStockTx = async (req, res) =>
{
    try
    {
        const stockTxId = req.params.stock_tx_id;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.findById(stockTxId);

        if (!existingStockTx) handleError(createError('Wallet transaction not found', 400));

        // update is_deleted flag
        existingStockTx.is_deleted = true;
        await existingStockTx.save();

        successReturn(res, existingStockTx);
    }
    catch (error)
    {
        handleError(error, res, next);
        console.error('Error updating stock transaction:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getStockTransactions
exports.getStockTransactions = async (req, res) =>
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

        successReturn(res, transformedStockTx);
        
    }
    catch (error) 
    {
        handleError(error, res, next);
        console.error('Error getting stock transactions:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}


// /getAllStockTransactions
exports.getAllStockTransactions =  async (req, res) =>
{

    try 
    {
        const stockTx = await StockTransaction.find({}).sort({ time_stamp: 1 }) || {};
        successReturn(res, stockTx);
    }
    catch (error) 
    {
        handleError(error, res, next);
        console.error('Error getting stock transactions:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

