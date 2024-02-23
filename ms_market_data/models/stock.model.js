
const base = require('../shared/models/modelOperations')
const { COLLECTIONS } = require('../shared/models/baseModel');


exports.createStock = (data) => {
	return base.createOne(COLLECTIONS.STOCK, [data])
}

exports.fetchStockById = (id) => {
	return base.findById(COLLECTIONS.STOCK, id)
}

exports.fetchStock = (id) => {
	return base.findOne(COLLECTIONS.STOCK, [data])
}

exports.updateStockPrice = (stock_id, new_price) =>
{
    return base.updateOneById(COLLECTIONS.STOCK, stock_id, { starting_price: new_price, current_price: new_price })
}