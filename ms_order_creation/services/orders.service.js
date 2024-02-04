const { createError } = require('../lib/apiHandling');
const { createTransaction, confirmTransaction, rollbackTransaction } = require('../models/base.model');
const ordersModel = require('../models/orders.model')
console.log("Here ------")

exports.placeOrder = async (data) => {
	// Send to limit order to Matching Engine  mmatching engine sends back response immediatly

	try {

		await ordersModel.placeOrder(data, trx)
		await ordersModel.placeOrder(data,trx);
	

	} catch (error) {
		console.log(error)
		await rollbackTransaction(trx)
		throw createError("Error Placing Order")
	}
	
}

exports.sellOrder = async (data) => {

	try {

		await ordersModel.sellOrder(data, trx)
	} catch (error) {
		console.log(error)
		throw createError("Error Placing Order")
	}
}

exports.cancelStockTransaction = async (data) => {
	// Send to cancel instructions to the market engine
}