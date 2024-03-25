const redisCache = require("../shared/config/redis");
const { COLLECTIONS } = require("../shared/models/baseModel")
const modelOperations = require("../shared/models/modelOperations")

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

exports.createPortfolio = async (data) => {
	const key = redisCache.getUserPortfolioRedisKey(data.user_id, data.stock_id);
	await modelOperations.createOne(COLLECTIONS.PORTFOLIO, data);
	await redisCache.setJson(key, data)
}

exports.fetchUserFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.USER, params)
	if (data) {
		const key = redisCache.getUserBalanceRedisKey(data._id)
		await redisCache.setJson(key, data)
	}
	return data
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


exports.createUser = async (data) => {
	console.log("Creating User ----------------")
	console.log(data)
	const key = redisCache.getUserBalanceRedisKey(data._id);
	await modelOperations.createOne(COLLECTIONS.USER, data);
	await redisCache.setJson(key, data)
}


