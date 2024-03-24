
const base = require('./base.model')

const { COLLECTIONS } = require('../shared/models/baseModel');
const redisCache = require("../shared/config/redis");

redisCache.connect();
exports.fetchPortfolio = async ({userId, stockId}) => {
	return base.findOne(COLLECTIONS.PORTFOLIO, {user_id: userId, stock_id: stockId})
}

exports.fetchPortfolio = async ({userId, stockId}) => {
	console.log("FEtching portfolio -----------")
	console.log(userId, stockId)
	const key = redisCache.getUserPortfolioRedisKey(userId, stockId)
	const cachedData = await redisCache.getJson(key)
	console.log(cachedData)
	if (cachedData) return cachedData

	const portfolio = await base.findOne(COLLECTIONS.PORTFOLIO, {user_id: userId, stock_id: stockId})
	console.log(portfolio)
	await redisCache.setJson(key, portfolio)

	return portfolio
}

exports.fetchBalance = async (user_id) => {

	const key = redisCache.getUserBalanceRedisKey(user_id)
	let data = await redisCache.getJson(key);
	if (data) return data

	data = await base.findById(COLLECTIONS.USER, user_id)
	await redisCache.setJson(key, data)
	return data
}

exports.updateBalance = async (user) => {
	console.log("UPdating user -----------")
	console.log(user)
	const key = redisCache.getUserBalanceRedisKey(user._id)
	await base.updateOneById(COLLECTIONS.USER, user._id, user);
	await redisCache.setJson(key, user)
}

exports.updatePortfolioStockQuantity = (id, quantity_owned) => {
	return base.updateOneById(COLLECTIONS.PORTFOLIO, id, {quantity_owned})
}

exports.createPortfolio = (data) => {
	return base.createOne(COLLECTIONS.PORTFOLIO, [data])
}

exports.deletePortfolio = (id) => {
	return base.deleteById(COLLECTIONS.PORTFOLIO, id)
}


/*

const base = require('./base.model')

const redisCache = require("../shared/config/redis");
const { COLLECTIONS } = require('../shared/models/baseModel');

redisCache.connect();

exports.fetchPortfolio = async ({userId, stockId}) => {
	console.log("FEtching portfolio -----------")
	console.log(userId, stockId)
	const cachedData = await redisCache.getJson(redisCache.getUserPortfolioRedisKey(userId))
	console.log(cachedData)
	if (cachedData) return cachedData

	const portfolio = await base.findOne(COLLECTIONS.PORTFOLIO, {user_id: userId, stock_id: stockId})
	console.log(portfolio)
	redisCache.setJson(redisCache.getUserPortfolioRedisKey(userId), portfolio)

	return 
}

exports.fetchBalance = async (user_id) => {
	const cachedData = await redisCache.getJson(redisCache.getUserBalanceRedisKey(user_id))
	if (cachedData) return cachedData
	const balance = await base.findById(COLLECTIONS.USER, user_id)
	redisCache.setJson(redisCache.getUserBalanceRedisKey(user_id), balance)
	return 
}

exports.updateBalance = async (user_id, balance) => {

	base.updateOneById(COLLECTIONS.USER, user_id, {balance})

	const key = redisCache.getUserBalanceRedisKey(user_id)
	let savedContent = await redisCache.getJson(key)
	if (!savedContent) {
		savedContent = await this.fetchBalance(user_id)
	}
	savedContent.balance = balance;
	return redisCache.setJson(key, savedContent)
}

exports.updatePortfolioStockQuantity = async (id, quantity_owned, user_id) => {
	console.log("Updatingni POrtfolio")
	base.updateOneById(COLLECTIONS.PORTFOLIO, id, {quantity_owned})

	const key = redisCache.getUserPortfolioRedisKey(user_id)
	let savedContent = await redisCache.getJson(key)
	console.log(savedContent)
	if (!savedContent) {
		savedContent = await this.fetchPortfolio(user_id)
	}
	savedContent.quantity_owned = quantity_owned;
	return redisCache.setJson(key, savedContent)
}

exports.createPortfolio = async (data) => {
	console.log("Creating a portfolio !0-------------------")
	base.createOne(COLLECTIONS.PORTFOLIO, [data])

	const key = redisCache.getUserPortfolioRedisKey(data.user_id)
	return await redisCache.setJson(key, data)
	
}

exports.deletePortfolio = (id) => {
	return base.deleteById(COLLECTIONS.PORTFOLIO, id)
}


*/

