const WalletTransaction = require('../models/walletTransactionModel');

// /createWalletTransaction
async function createWalletTx(req, res)
{
    try
    {
        const { is_debit, amount } = req.body;

        const newWalletTx = new WalletTransaction({ is_debit, amount })
        walletTx.save();

        return res.status(201).json(newWalletTx);
    } catch (error)
    {
        console.error('Error creating wallet transaciton:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /updateStockTxId/:walletTxId
async function updateStockTxId(req, res)
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;
        const { stock_tx_id } = req.body;

        // Check if the stock exists
        const existingWalletTx = await Stock.findById(walletTxId);

        if (!existingWalletTx)
        {
            return res.status(404).json({ message: 'Wallet Transaction not found' });
        }

        existingWalletTx.stock_tx_id = stock_tx_id;
        await existingWalletTx.save();

        return res.status(200).json(existingWalletTx);
    }
    catch (error)
    {
        console.error('Error updating stock price:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /deleteWalletTx/:walletTxId
async function deleteWalletTx(req, res)
{
    try
    {
        const walletTxId = req.params.wallet_tx_id;

        // Check if the transaction exists
        const existingWalletTx = await Stock.findById(walletTxId);

        if (!existingWalletTx)
        {
            return res.status(404).json({ message: 'Wallet Transaction not found' });
        }
        // update 
        existingWalletTx.is_deleted = true;
        await existingWalletTx.save();

        return res.status(200).json(existingWalletTx);
    }
    catch (error)
    {
        console.error('Error updating stock price:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getWalletTransactions
async function getWalletTransactions(req, res)
{

    try 
    {
        // get all wallet transaction that are not deleted. Sort by time_stamp. 1 for ascending order. 
        const walletTx = await WalletTransaction.find({ is_deleted: false }).sort({ time_stamp: 1 }) || {};

        // Map the documents and rename _id to wallet_tx_id
        const transformedWalletTx = walletTx.map(tx => ({
            wallet_tx_id: tx._id
        }));

        return res.status(200).json(transformedWalletTx);
    }
    catch (error) 
    {
        console.error('Error getting stock prices:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

// /getWalletTransactions
async function getAllWalletTransactions(req, res)
{

    try 
    {
        // get all wallet transaction that are not deleted. Sort by time_stamp. 1 for ascending order. 
        const walletTx = await WalletTransaction.find().sort({ time_stamp: 1 }) || {};

        // Map the documents and rename _id to wallet_tx_id
        const transformedWalletTx = walletTx.map(tx => ({
            wallet_tx_id: tx._id
        }));

        return res.status(200).json(transformedWalletTx);
    }
    catch (error) 
    {
        console.error('Error getting stock prices:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}


module.exports = {
    createWalletTx,
    updateStockTxId,
    deleteWalletTx,
    getWalletTransactions,
    getAllWalletTransactions
};