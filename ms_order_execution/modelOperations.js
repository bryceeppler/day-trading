


const redisCache = require("./shared/config/redis");
const { COLLECTIONS } = require("./shared/models/baseModel")
const modelOperations = require("./shared/models/modelOperations")

redisCache.connect();

exports.fetchPortfolio = async (user_id, stock_id) => {
	const key = redisCache.getUserPortfolioRedisKey(user_id, stock_id)
	let data = await redisCache.getJson(key);
	if (data) return data

	data = await modelOperations.findOne(COLLECTIONS.PORTFOLIO, {user_id, stock_id})
	await redisCache.setJson(key, data)
	return data
}
exports.updatePortfolio = async (data) => {
	const key = redisCache.getUserPortfolioRedisKey(data.user_id, data.stock_id)
	await modelOperations.updateOneById(COLLECTIONS.PORTFOLIO, data._id, data);
	await redisCache.setJson(key, data)
}



exports.fetchStock = async (stock_id) => {
	const key = redisCache.getStockRedisKey(stock_id)
	let data = await redisCache.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.STOCK, stock_id)
	await redisCache.setJson(key, data)
	return data
}
exports.updateStock = async (data) => {
	const key = redisCache.getStockRedisKey(data._id)
	await modelOperations.updateOneById(COLLECTIONS.STOCK, data._id, data);
	await redisCache.setJson(key, data)
}



exports.fetchStockTransaction = async (stockTxId) => {
	const key = redisCache.getStockTranstionRedisKey(stockTxId)
	let data = await redisCache.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.STOCK_TRANSACTION, stockTxId)
	await redisCache.setJson(key, data)
	return data
}


exports.fetchStockTransactionFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.STOCK_TRANSACTION, params)
	if (data) {
		const key = redisCache.getStockTranstionRedisKey(data._id)
		await redisCache.setJson(key, data)
	}
	return data
}

exports.updateStockTransaction = async (data) => {
	const key = redisCache.getStockTranstionRedisKey(data._id)
	await modelOperations.updateOneById(COLLECTIONS.STOCK_TRANSACTION, data._id, data);
	await redisCache.setJson(key, data)
}

exports.createStockTransaction = async (data) => {
	const key = redisCache.getStockTranstionRedisKey(data._id)
	await modelOperations.createOne(COLLECTIONS.STOCK_TRANSACTION, data);
	await redisCache.setJson(key, data)
}



exports.fetchWalletTransactionFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.WALLET_TRANSACTION, params)
	if (data) {
		const key = redisCache.getWalletTranstionRedisKey(data._id)
		await redisCache.setJson(key, data)
	}
	return data
}

exports.updateWalletTransaction = async (data) => {
	const key = redisCache.getWalletTranstionRedisKey(data._id)
	await modelOperations.updateOneById(COLLECTIONS.WALLET_TRANSACTION, data._id, data);
	await redisCache.setJson(key, data)
}

exports.createWalletTransaction = async (data) => {
	const key = redisCache.getWalletTranstionRedisKey(data._id);
	await modelOperations.createOne(COLLECTIONS.WALLET_TRANSACTION, data);
	await redisCache.setJson(key, data)
}




exports.fetchUser = async (user_id) => {
	const key = redisCache.getUserBalanceRedisKey(user_id)
	let data = await redisCache.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.USER, user_id)
	await redisCache.setJson(key, data)
	return data
}

exports.updateUser = async (data) => {
	const key = redisCache.getUserBalanceRedisKey(data._id)
	await modelOperations.updateOneById(COLLECTIONS.USER, data._id, data);
	await redisCache.setJson(key, data)
}


