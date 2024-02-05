const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const walletTxSchema = new mongoose.Schema({
    stock_tx_id: { type: ObjectId, unique: true },
    is_debit: { type: Boolean, required: true },
    amount: { type: Number, required: true },
    time_stamp: { type: Date, required: true, default: Date.now },
    is_deleted: { type: Boolean, required: true, default: false },
});

const WalletTransaction = mongoose.model('WalletTransaction', walletTxSchema);

module.exports = WalletTransaction;