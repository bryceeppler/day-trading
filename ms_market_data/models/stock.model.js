
const base = require('../shared/models/modelOperations')
const { COLLECTIONS } = require('../shared/models/baseModel');


exports.createStock = (data) => {
	return base.createOne(COLLECTIONS.STOCK, [data])
}

exports.fetchStock = (id) => {
	return base.findById(COLLECTIONS.STOCK, id)
}

exports.fetchStockByName = async (name) => {
	return base.findOne(COLLECTIONS.STOCK, {stock_name: name})
}

exports.fetchAllStocks = async (data) => {
	return base.findAll(COLLECTIONS.STOCK, data)
}

exports.updateStockPrice = async (stock_id, new_price) =>
{
	return base.updateOneById(COLLECTIONS.STOCK, stock_id, { starting_price: new_price, current_price: new_price })
}