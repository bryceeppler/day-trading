
const redisCache = require("../shared/config/redis");
const base = require('../shared/models/modelOperations')
const { COLLECTIONS } = require('../shared/models/baseModel');
const StockModel = require('../shared/models/stockModel');

redisCache.connect();

exports.createStock = async (data) => {
	const newStock = StockModel(data)
	await base.createOne(COLLECTIONS.STOCK, newStock)
	const key = redisCache.getStockRedisKey(newStock._id);
	await redisCache.setJson(key, newStock)

	return newStock
}

exports.fetchStock = async (id) => {
	const key = redisCache.getStockRedisKey(id)
	let data = await redisCache.getJson(key);
	if (data) return data

	data = await base.findById(COLLECTIONS.STOCK, id)
	await redisCache.setJson(key, data)
	return data

}

exports.fetchStockByName = async (name) => {

	const data = await base.findOne(COLLECTIONS.STOCK, {stock_name: name})
	if (data) {
		const key = redisCache.getStockRedisKey(data._id)
		await redisCache.setJson(key, data)
	}
	return data
}

exports.fetchAllStocks = async (data) => {
	return base.findAll(COLLECTIONS.STOCK, data)
}

exports.updateStockPrice = async (data) =>
{
	const key = redisCache.getStockRedisKey(data._id)
	await modelOperations.updateOneById(COLLECTIONS.STOCK, data._id, data);
	await redisCache.setJson(key, data)
}