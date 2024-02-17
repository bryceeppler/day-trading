const mongoose = require('mongoose');
const base = require('./baseModel');

const stockSchema = new mongoose.Schema({
    stock_name: { type: String, required: true, unique: true },
    starting_price: { type: Number, required: true, min: 0 },
    current_price: { type: Number, required: true, min: 0 },
    creation_date: { type: Date, required: true, default: Date.now },
});

const Stock = mongoose.model(base.COLLECTIONS.STOCK, stockSchema);

module.exports = Stock;