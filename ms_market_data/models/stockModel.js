const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stock_name: { type: String, required: true, unique: true },
    starting_price: { type: Number, required: true, min: 0 },
    current_price: { type: Number, required: true, min: 0 },
    creation_date: { type: Date, required: true, default: Date.now },
});

const Stock = mongoose.model('Stock', stockSchema);

module.exports = Stock;