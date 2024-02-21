const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { ORDER_STATUS, ORDER_TYPE } = require('../lib/enums');

const stockTxSchema = new mongoose.Schema({
    stock_id: { type: ObjectId, required: true, unqiue: false },
    wallet_tx_id: { type: ObjectId, required: true, unique: false },
    order_status: { type: String, enum: Object.values(ORDER_STATUS), required: true, default: ORDER_STATUS.IN_PROGRESS },
    is_buy: { type: Boolean, required: true },
    order_type: { type: String, enum: Object.values(ORDER_TYPE), required: true },
    stock_price: { type: Number, required: true, min: [0, "stock_price must be non negative."] },
    quantity: { type: Number, required: true, min: [1, "quantity must be greater than 0"] },
    time_stamp: { type: Date, required: true, default: Date.now },
    is_deleted: { type: Boolean, required: true, default: false },
});

const StockTransaction = mongoose.model('StockTransaction', stockTxSchema);

module.exports = StockTransaction;