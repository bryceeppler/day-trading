const mongoose = require('mongoose');
const { handleError, createError } = require('../shared/lib/apiHandling');
const config = require('../config/config');
const StockTransactionModel = require('../shared/models/stockTransactionModel');
const UsersModel = require('../shared/models/userModel');
const PortfolioModel = require('../shared/models/portfolioModel');
const WalletTransactionModel = require('../shared/models/walletTransactionModel');
const StockModel = require('../shared/models/stockModel');
const { COLLECTIONS } = require('../shared/models/baseModel');


const modelMap = {
	[COLLECTIONS.USER]: UsersModel,
	[COLLECTIONS.PORTFOLIO]: PortfolioModel,
	[COLLECTIONS.WALLET_TRANSACTION]: WalletTransactionModel,
	[COLLECTIONS.STOCK]: StockModel
};

mongoose.connect(
	config.mongodb,
	{ authSource: 'admin' }
)
	.then(() =>
	{
		console.log("Mongo DB - Connected")
		console.log("         - Port: 27017")
		console.log("         - Database: db")
	})
	.catch((error) => console.log(error))


exports.createOne = async (collection, data) =>
{
	let model
	if (collection === COLLECTIONS.WALLET_TRANSACTION)
	{
		model = WalletTransactionModel
	} else if (collection === COLLECTIONS.STOCK_TRANSACTION)
	{
		model = StockTransactionModel
	} else if (collection === COLLECTIONS.PORTFOLIO)
	{
		model = PortfolioModel
	} else
	{
		throw createError('Schema not created')
	}
	const result = await model.create(data)
	return result[0]

}

exports.findById = async (collection, id) =>
{
	let model
	if (collection === COLLECTIONS.USER)
	{
		model = UsersModel
	} else if (collection === COLLECTIONS.PORTFOLIO)
	{
		model = PortfolioModel
	} else if (collection === COLLECTIONS.STOCK)
	{
		model = StockModel
	} else
	{
		throw createError('Schema not created')
	}

	return await model.findById(id);

}

exports.findOne = async (collection, data) =>
{
	let model
	if (collection === COLLECTIONS.PORTFOLIO)
	{
		model = PortfolioModel
	} else
	{
		throw createError('Schema not created')
	}
	return await model.findOne(data);
}

exports.updateOneById = async (collection, id, newValues) =>
{
	const model = modelMap[collection];
	if (!model) throw createError('Schema not created');
	
	return await model.updateOne(
		{ _id: id },
		{ $set: newValues }
	);
}


exports.deleteById = async (collection, id) =>
{
	let model
	if (collection === COLLECTIONS.USER)
	{
		model = UsersModel
	} else if (collection === COLLECTIONS.WALLET_TRANSACTION)
	{
		model = WalletTransactionModel
	} else if (collection === COLLECTIONS.STOCK_TRANSACTION)
	{
		model = StockTransactionModel
	} else
	{
		throw createError('Schema not created')
	}

	return await model.deleteOne({ _id: id });
}