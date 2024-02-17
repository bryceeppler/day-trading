const mongoose = require('mongoose');
const { createError } = require('../lib/apiHandling');
const config = require('../config/config');

mongoose.connect(
	config.mongodb,
	{ authSource:'admin' }
	)
  .then(() => {
		console.log("Mongo DB - Connected")
		console.log("         - Port: 27017")
		console.log("         - Database: db")
	})
	.catch((error) => console.log(error))

exports.COLLECTIONS = {
	PORTFOLIO: 'Portfolios',
	STOCK_TRANSACTION: 'StockTransactions',
	WALLET_TRANSACTION: 'WalletTransactions',
	USERS: 'Users',
}

const PortfolioSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId},
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  stock_id: { type: mongoose.Schema.Types.ObjectId, required: true }, 
	quantity_owned: { type: Number }
});


const UsersSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
	user_name: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	balance: { type: Number, required: true }
})

const WalletTransactionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  is_debit: { type: Boolean, required: true },
	amount: { type: Number, required: true },
  time_stamp: { type: Date, default: Date.now() },
  is_deleted: { type: Boolean, default: false },
})

const StockTransactionSchema = new mongoose.Schema({
	stock_id: { type:  mongoose.Schema.Types.ObjectId, required: true },
	wallet_tx_id: { type: mongoose.Schema.Types.ObjectId },
  order_status: { 
		type: String, 
		required: true,
		enum: ['IN_PROGRESS', 'CANCELED', 'COMPLETED', 'EXPIRED'],
		default: 'IN_PROGRESS'
	 },
  is_buy: { type: Boolean, required: true },
	order_type: { type: String, enum: ['LIMIT', 'MARKET'], required: true },
	quantity: { type: Number, required: true },
  time_stamp: { type: Date, default: Date.now() },
  is_deleted: { type: Boolean, default: false },
})

const PortfolioModel = mongoose.model(this.COLLECTIONS.PORTFOLIO, PortfolioSchema);
const UsersModel = mongoose.model(this.COLLECTIONS.USERS, UsersSchema);
const StockTransactionModel = mongoose.model(this.COLLECTIONS.STOCK_TRANSACTION, StockTransactionSchema);
const WalletTransactionModel = mongoose.model(this.COLLECTIONS.WALLET_TRANSACTION, WalletTransactionSchema);









exports.createOne = async (collection, data) => {
	let model
	if (collection === this.COLLECTIONS.WALLET_TRANSACTION) {
		model =  WalletTransactionModel
	} else if (collection === this.COLLECTIONS.STOCK_TRANSACTION) { 
		model =  StockTransactionModel
	} else {
		throw createError('Schema not created')
	}
	const result = await model.create(data)
	return result[0]

}

exports.findById = async (collection, id) => {
	let model
	if (collection === this.COLLECTIONS.USERS) {
		model = UsersModel
	} else if (collection === this.COLLECTIONS.PORTFOLIO) {
		model = PortfolioModel
	} else{
		throw createError('Schema not created')
	}

	const results = await model.findById(id);
	return results
}

exports.findOne = async (collection, data) => {
	let model
	if (collection === this.COLLECTIONS.PORTFOLIO) {
		model = PortfolioModel
	} else {
		throw createError('Schema not created')
	}
	console.log(collection)
	console.log(data)
	const results = await model.findOne(data);
	console.log(results)
	return results
}

exports.updateOneById = async (collection, id, newValues) => {
	let model
	if (collection === this.COLLECTIONS.USERS) {
		model = UsersModel
	} else if (collection === this.COLLECTIONS.PORTFOLIO) {
		model = PortfolioModel
	} else {
		throw createError('Schema not created')
	}

	return await model.updateOne(
		{ _id: id },
		{ $set: newValues }
	);
}


exports.deleteById = async (collection, id) => {
	let model
	if (collection === this.COLLECTIONS.USERS) {
		model = UsersModel
	} else if (collection === this.COLLECTIONS.WALLET_TRANSACTION) {
		model =  WalletTransactionModel
	} else if (collection === this.COLLECTIONS.STOCK_TRANSACTION) { 
		model =  StockTransactionModel
	} else {
		throw createError('Schema not created')
	}

	return await model.deleteOne({_id: id});
}