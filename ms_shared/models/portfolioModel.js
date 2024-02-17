const mongoose = require('mongoose');
const base = require('./baseModel');

const ObjectId = mongoose.Types.ObjectId;

const PortfolioSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    stock_id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    quantity_owned: { type: Number, required: true, min: [0, "quantity_owned must be non negative."] }
  });

const Portfolio = mongoose.model(base.COLLECTIONS.PORTFOLIO, PortfolioSchema);

module.exports = Portfolio;