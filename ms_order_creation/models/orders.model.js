const { COLLECTIONS } = require('../lib/db')
const base = require('./base.model')

exports.placeOrder = (data, trx) => {
	return base.save(COLLECTIONS.BUY_ORDERS, [data], trx)
}
exports.sellOrder = (data, trx) => {
	return base.save(COLLECTIONS.SELL_ORDERS, [data], trx)
}
exports.findOrders = (params) => {
	base.find(COLLECTIONS.BUY_ORDERS, params)
}



exports.placeMarketOrder = (data) => {
	
}