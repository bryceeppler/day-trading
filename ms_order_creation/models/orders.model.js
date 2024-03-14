
const base = require('./base.model')
const { COLLECTIONS } = require('../shared/models/baseModel');


exports.createWalletTransaction = (data) => {
	return base.createOne(COLLECTIONS.WALLET_TRANSACTION, [data])
}

exports.deleteWalletTransaction = (id) => {
	return base.deleteById(COLLECTIONS.WALLET_TRANSACTION, id)
}
exports.fetchStock = (id) => {
	return base.findById(COLLECTIONS.STOCK, id)
}

exports.createStockTransaction = (data) => {
	return base.createOne(COLLECTIONS.STOCK_TRANSACTION, [data])
}

exports.deleteStockTransaction = (id) => {
	return base.deleteById(COLLECTIONS.STOCK_TRANSACTION, id)
}

exports.updateStockTxId = (wallet_tx_id, stock_tx_id) => {
	return base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, wallet_tx_id, {stock_tx_id})
}

exports.updateStockPrice = (stock_id, new_price) =>
{
    return base.updateOneById(COLLECTIONS.STOCK, stock_id, { starting_price: new_price, current_price: new_price })
}