const WalletTransaction = require('../models/walletTx.model');
const { handleError, successReturn, errorReturn } = require('../shared/lib/apiHandling');
const { STATUS_CODE } = require('../shared/lib/enums');

// /createWalletTransaction
exports.createWalletTx = async (req, res, next) =>
{
    try
    {
        const { user_id, is_debit, amount } = req.body;

        const walletTx = await WalletTransaction.createTransaction({ user_id, is_debit, amount });

        return successReturn(res, walletTx, STATUS_CODE.CREATED);
    } catch (error)
    {
        return handleError(error, res, next);
    }
}

// /updateStockTxId/:walletTxId
exports.updateStockTxId = async (req, res, next) =>
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;
        const { stock_tx_id } = req.body;

        // Check if the stock exists
        const existingWalletTx = await WalletTransaction.fetchTransaction(walletTxId);

        if (!existingWalletTx)
        {
            return errorReturn(res, 'Wallet transaction not found');
        }

        await WalletTransaction.updateStockTxId(walletTxId, stock_tx_id);

        return successReturn(res, existingWalletTx);
    }
    catch (error)
    {
        return handleError(error, res, next);
    }
}

// /deleteWalletTx/:walletTxId
exports.deleteWalletTx = async (req, res, next) =>
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;

        // Check if the transaction exists
        const existingWalletTx = await WalletTransaction.fetchTransaction(walletTxId);

        if (!existingWalletTx)
        {
            return errorReturn(res, 'Wallet transaction not found');
        }

        WalletTransaction.softDeleteTransaction(walletTxId);

        return successReturn(res, existingWalletTx);
    }
    catch (error)
    {
        return handleError(error, res, next);
    }
}

// /getWalletTransactions
exports.getWalletTransactions = async (req, res, next) =>
{

    try 
    {
        // get all wallet transaction that are not deleted. Sort by time_stamp. 1 for ascending order. 
        const walletTx = await WalletTransaction.fetchAllTransactions(
            { user_id: req.user?.userId, is_deleted: false }, // Filter criteria
            { time_stamp: 1 } // sort options
            ) || {};

        // Map the documents and rename _id to wallet_tx_id
        const transformedWalletTx = walletTx.map(tx => ({
            wallet_tx_id: tx._id,
            stock_tx_id: tx.stock_tx_id,
            is_debit: tx.is_debit,
            amount: tx.amount,
            time_stamp: tx.time_stamp,
        }));

        return successReturn(res, transformedWalletTx);
    }
    catch (error) 
    {
        return handleError(error, res, next);
    }
}

// /geAlltWalletTransactions
exports.getAllWalletTransactions = async (req, res, next) =>
{
    try 
    {
        const walletTx = await WalletTransaction.fetchAllTransactions({}, { time_stamp: 1 }) || {};;
        return successReturn(res, walletTx);
    }
    catch (error) 
    {
        return handleError(error, res, next);
    }
}