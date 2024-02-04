const mongoose = require('mongoose');
const { COLLECTIONS, BUY_ORDER_SCHEMA } = require('../lib/db');
const { createError } = require('../lib/apiHandling');


mongoose.connect(
	'mongodb://mongodb:mongodb@localhost:27017/db',
	{ authSource:'admin', useNewUrlParser: true, useUnifiedTopology: true }
	)
  .then(() => {
		console.log("Mongo DB - Connected")
		console.log("         - Port: 27017")
		console.log("         - Database: db")
	})
	.catch((error) => console.log(error))

const BuyOrdersSchema = new mongoose.Schema(BUY_ORDER_SCHEMA)
const BUY_ORDERS_MODEL = mongoose.model(COLLECTIONS.BUY_ORDERS, BuyOrdersSchema);




exports.save = async (collection, data, trx) => {
	let model
	if (collection === COLLECTIONS.BUY_ORDERS) {
		model = BUY_ORDERS_MODEL
	} else {
		throw createError('Schema not created')
	}
	return model.create(data, {session: trx})

}

exports.find = async (collection, params) => {
	let model
	if (collection === COLLECTIONS.BUY_ORDERS) {
		model = BUY_ORDERS_MODEL
	} else {
		throw createError('Schema not created')
	}

	const results = await model.find(params);
	console.log(results)
}

exports.findById = async (collection, id) => {
	let model
	if (collection === COLLECTIONS.BUY_ORDERS) {
		model = BUY_ORDERS_MODEL
	} else {
		throw createError('Schema not created')
	}

	const results = await model.findById(id);
	console.log(results)
}


