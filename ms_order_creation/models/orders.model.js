
const base = require('./base.model')


exports.createWalletTransaction = (data) => {
	return base.createOne(base.COLLECTIONS.WALLET_TRANSACTION, [data])
}

exports.deleteWalletTransaction = (id) => {
	return base.deleteById(base.COLLECTIONS.WALLET_TRANSACTION, id)
}


exports.createStockTransaction = (data) => {
	return base.createOne(base.COLLECTIONS.STOCK_TRANSACTION, [data])
}

exports.deleteStockTransaction = (id) => {
	return base.deleteById(base.COLLECTIONS.STOCK_TRANSACTION, id)
}