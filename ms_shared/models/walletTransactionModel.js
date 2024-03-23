const mongoose = require('mongoose');
const base = require('./baseModel');

const ObjectId = mongoose.Types.ObjectId;

const walletTxSchema = new mongoose.Schema({
    user_id: { type: ObjectId, required: true },
    stock_tx_id: { type: ObjectId, unique: false, default: null },
    is_debit: { type: Boolean, required: true },
    amount: { type: Number, required: true },
    time_stamp: { type: Date, required: true, default: Date.now },
    is_deleted: { type: Boolean, required: true, default: false },
});

walletTxSchema.index({user_id: 1}); // for transaction service
walletTxSchema.index({stock_tx_id: 1}); // for execution service

const WalletTransaction = mongoose.model(base.COLLECTIONS.WALLET_TRANSACTION, walletTxSchema);

module.exports = WalletTransaction;