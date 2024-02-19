const WalletTransaction = require('../shared/models/walletTransactionModel');
const { successReturn } = require('../shared/lib/apiHandling');

// /createWalletTransaction
exports.createWalletTx = async (req, res) =>
{
    try
    {
        const { is_debit, amount } = req.body;

        const walletTx = new WalletTransaction({ is_debit, amount })
        walletTx.save();

        successReturn(res, STATUS_CODE.CREATED, newStockTx);


    } catch (error)
    {
        handleError(error, res, next);
        console.error('Error creating wallet transaciton:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /updateStockTxId/:walletTxId
exports.updateStockTxId = async (req, res) =>
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;
        const { stock_tx_id } = req.body;

        // Check if the stock exists
        const existingWalletTx = await WalletTransaction.findById(walletTxId);

        if (!existingWalletTx)
        {
            return res.status(404).json({ message: 'Wallet Transaction not found' });
        }

        existingWalletTx.stock_tx_id = stock_tx_id;
        await existingWalletTx.save();

        successReturn(res, existingWalletTx);
    }
    catch (error)
    {
        handleError(error, res, next);
        console.error('Error updating wallet transaction:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /deleteWalletTx/:walletTxId
exports.deleteWalletTx = async (req, res) =>
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;

        // Check if the transaction exists
        const existingWalletTx = await WalletTransaction.findById(walletTxId);

        if (!existingWalletTx)
        {
            return res.status(404).json({ message: 'Wallet Transaction not found' });
        }
        // update 
        existingWalletTx.is_deleted = true;
        await existingWalletTx.save();
        
        successReturn(res, existingWalletTx);
    }
    catch (error)
    {
        handleError(error, res, next);
        console.error('Error updating wallet transaction:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getWalletTransactions
exports.getWalletTransactions = async (req, res) =>
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
        console.error('Error getting wallet trasactions:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /geAlltWalletTransactions
exports.getAllWalletTransactions = async (req, res) =>
{
    try 
    {
        const walletTx = await WalletTransaction.find({}).sort({ time_stamp: 1 }) || {};;
        successReturn(res, walletTx);
    }
    catch (error) 
    {
        handleError(error, res, next);
        console.error('Error getting wallet transactions:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}