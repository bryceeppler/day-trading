const { STATUS_CODE } = require('../shared/lib/enums');
const { handleError, successReturn, errorReturn } = require('../shared/lib/apiHandling');
const StockTransaction = require('../models/stockTx.model');

// /createWalletTransaction
exports.createStockTx = async (req, res, next) =>
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

        const newStockTx = await StockTransaction.createTransaction({
            stock_id,
            wallet_tx_id,
            portfolio_id,
            is_buy,
            order_type,
            stock_price,
            quantity,
        });

        return successReturn(res, newStockTx, STATUS_CODE.CREATED);
    } catch (error)
    {
        return handleError(error, res, next);
    }
}

// /updateStockTxStatus/:stockTxId
exports.updateStockTxStatus = async (req, res, next) =>
{
    try
    {
        const stockTxId = req.params.stock_tx_id;
        const { order_status } = req.body;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.fetchTransaction(stockTxId);

        if (!existingStockTx) 
        {
            return errorReturn(res, 'Stock transaction not found');
        }

        await StockTransaction.updateOrderStatus(stockTxId, order_status);

        return successReturn(res, existingStockTx);
    }
    catch (error)
    {
        return handleError(error, res, next);
    }
}

// /deleteStockTx/:StockTxId
exports.deleteStockTx = async (req, res, next) =>
{
    try
    {
        const stockTxId = req.params.stock_tx_id;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.fetchTransaction(stockTxId);

        if (!existingStockTx)
        {
            return errorReturn(res, 'Stock transaction not found');
        }

        // update is_deleted flag
        await StockTransaction.softDeleteTransaction();

        return successReturn(res, existingStockTx);
    }
    catch (error)
    {
        return handleError(error, res, next);
    }
}

// /getStockTransactions
exports.getStockTransactions = async (req, res, next) =>
{

    try 
    {
        // get all stock transaction that are not deleted. Sort by time stamp, 1 for ascending.  
        const stockTx = await StockTransaction.fetchAllTransactions(
            { user_id: req.user?.userId, is_deleted: false }, // Filter criteria
            { time_stamp: 1 } // Sort function
        ) || {};

        // Map the documents and rename _id to stock_tx_id
        const transformedStockTx = stockTx.map(tx => ({
            stock_tx_id: tx._id,
            parent_stock_tx_id: tx.parent_stock_tx_id,
            stock_id: tx.stock_id,
            wallet_tx_id: tx.wallet_tx_id,
            order_status: tx.order_status,
            is_buy: tx.is_buy,
            order_type: tx.order_type,
            stock_price: tx.stock_price,
            quantity: tx.quantity,
            time_stamp: tx.time_stamp,
        }));

        return successReturn(res, transformedStockTx);

    }
    catch (error) 
    {
        return handleError(error, res, next);
    }
}


// /getAllStockTransactions
exports.getAllStockTransactions = async (req, res, next) =>
{

    try 
    {
        const stockTx = await StockTransaction.fetchAllTransactions({}, { time_stamp: 1 }) || {};
        return successReturn(res, stockTx);
    }
    catch (error) 
    {
        return handleError(error, res, next);
    }
}

