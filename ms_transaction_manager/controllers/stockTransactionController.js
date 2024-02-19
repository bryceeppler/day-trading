const { STATUS_CODE } = require('../shared/lib/enums');
const { successReturn, handleError, createError } = require('../shared/lib/apiHandling');
const StockTransaction = require('../shared/models/stockTransactionModel');

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

        successReturn(res, newStockTx, STATUS_CODE.CREATED);
    } catch (error)
    {
        handleError(error, res, next);
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
        const existingStockTx = await StockTransaction.findById(stockTxId);

        if (!existingStockTx) handleError(createError('Stock transaction not found', STATUS_CODE.NOT_FOUND), res, next);

        existingStockTx.order_status = order_status;
        await existingStockTx.save();

        successReturn(res, existingStockTx);
    }
    catch (error)
    {
        handleError(error, res, next);
    }
}

// /deleteStockTx/:StockTxId
exports.deleteStockTx = async (req, res, next) =>
{
    try
    {
        const stockTxId = req.params.stock_tx_id;

        // Check if the transaction exists
        const existingStockTx = await StockTransaction.findById(stockTxId);

        if (!existingStockTx) handleError(createError('Stock transaction not found', STATUS_CODE.NOT_FOUND), res, next);

        // update is_deleted flag
        existingStockTx.is_deleted = true;
        await existingStockTx.save();

        successReturn(res, existingStockTx);
    }
    catch (error)
    {
        handleError(error, res, next);
    }
}

// /getStockTransactions
exports.getStockTransactions = async (req, res, next) =>
{

    try 
    {
        // get all stock transaction that are not deleted.  
        const stockTx = await StockTransaction.find({ is_deleted: false }).sort({ time_stamp: 1 }) || {};

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

        successReturn(res, transformedStockTx);

    }
    catch (error) 
    {
        handleError(error, res, next);
    }
}


// /getAllStockTransactions
exports.getAllStockTransactions = async (req, res, next) =>
{

    try 
    {
        const stockTx = await StockTransaction.find({}).sort({ time_stamp: 1 }) || {};
        successReturn(res, stockTx);
    }
    catch (error) 
    {
        handleError(error, res, next);
    }
}

