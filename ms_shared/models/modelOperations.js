
const { handleError, createError } = require('../lib/apiHandling');
const StockTransactionModel = require('./stockTransactionModel');
const UsersModel = require('./userModel');
const PortfolioModel = require('./portfolioModel');
const WalletTransactionModel = require('./walletTransactionModel');
const StockModel = require('./stockModel');
const { COLLECTIONS } = require('./baseModel');


const modelMap = {
	[COLLECTIONS.USER]: UsersModel,
	[COLLECTIONS.PORTFOLIO]: PortfolioModel,
	[COLLECTIONS.WALLET_TRANSACTION]: WalletTransactionModel,
	[COLLECTIONS.STOCK_TRANSACTION]: StockTransactionModel,
	[COLLECTIONS.STOCK]: StockModel
};


exports.createOne = async (collection, data) =>
{
	const model = modelMap[collection];
	if (!model) throw createError('Schema not created');
	const result = await model.create(data)
	return result[0]

}

exports.findById = async (collection, id) =>
{
	const model = modelMap[collection];
	if (!model) throw createError('Schema not created');

	return await model.findById(id);

}

exports.findOne = async (collection, data) =>
{
	const model = modelMap[collection];
	if (!model) throw createError('Schema not created');
	return await model.findOne(data);
}

exports.findAll = async (collection, data) =>
{
	const model = modelMap[collection];
	if (!model) throw createError('Schema not created');
	return await model.find(data);
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
	const model = modelMap[collection];
	if (!model) throw createError('Schema not created');

	return await model.deleteOne({ _id: id });
}