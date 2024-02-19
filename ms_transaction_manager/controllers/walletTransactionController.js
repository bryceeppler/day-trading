const WalletTransaction = require('../shared/models/walletTransactionModel');
const { successReturn, handleError, createError } = require('../shared/lib/apiHandling');
const { STATUS_CODE } = require('../shared/lib/enums');

// /createWalletTransaction
exports.createWalletTx = async (req, res, next) =>
{
    try
    {
        const { user_id, is_debit, amount } = req.body;

        const walletTx = new WalletTransaction({ user_id, is_debit, amount })
        walletTx.save();

        successReturn(res, walletTx, STATUS_CODE.CREATED);


    } catch (error)
    {
        handleError(error, res, next);
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
        const existingWalletTx = await WalletTransaction.findById(walletTxId);

        if (!existingWalletTx)
        {
            handleError(createError('Wallet transaction not found', STATUS_CODE.NOT_FOUND), res, next);
        }

        existingWalletTx.stock_tx_id = stock_tx_id;
        await existingWalletTx.save();

        successReturn(res, existingWalletTx);
    }
    catch (error)
    {
        handleError(error, res, next);
    }
}

// /deleteWalletTx/:walletTxId
exports.deleteWalletTx = async (req, res, next) =>
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;

        // Check if the transaction exists
        const existingWalletTx = await WalletTransaction.findById(walletTxId);

        if (!existingWalletTx)
        {
            handleError(createError('Wallet transaction not found', STATUS_CODE.NOT_FOUND), res, next);
        }
        // update 
        existingWalletTx.is_deleted = true;
        await existingWalletTx.save();

        successReturn(res, existingWalletTx);
    }
    catch (error)
    {
        handleError(error, res, next);
    }
}

// /getWalletTransactions
exports.getWalletTransactions = async (req, res, next) =>
{

    try 
    {
        // get all wallet transaction that are not deleted. Sort by time_stamp. 1 for ascending order. 
        const walletTx = await WalletTransaction.find({ is_deleted: false }).sort({ time_stamp: 1 }) || {};

        // Map the documents and rename _id to wallet_tx_id
        const transformedWalletTx = walletTx.map(tx => ({
            wallet_tx_id: tx._id,
            stock_tx_id: tx.stock_tx_id,
            is_debit: tx.is_debit,
            amount: tx.amount,
            time_stamp: tx.time_stamp,
        }));

        successReturn(res, transformedWalletTx);
    }
    catch (error) 
    {
        handleError(error, res, next);
    }
}

// /geAlltWalletTransactions
exports.getAllWalletTransactions = async (req, res, next) =>
{
    try 
    {
        const walletTx = await WalletTransaction.find({}).sort({ time_stamp: 1 }) || {};;
        successReturn(res, walletTx);
    }
    catch (error) 
    {
        handleError(error, res, next);
    }
}