
const redis = require('redis');
const { promisify } = require('util')
const { COLLECTIONS } = require("../models/baseModel")
const modelOperations = require("../models/modelOperations")


let redisCLient;
let redisGet
let redisSet
let redisDelete
exports.connect = () => {
	return new Promise((resolve, reject) => {
		redisCLient = redis.createClient('6379', 'redis_cache')

		redisCLient.on('error', error => console.error(error))
		redisCLient.on('ready', () => {
		
			console.log("Redis Cache - Connected")
			redisGet = promisify(redisCLient.get).bind(redisCLient)
			console.log("            - Getter Created")
			redisSet = promisify(redisCLient.set).bind(redisCLient)	
			console.log("            - Setter Created")
			redisDelete = promisify(redisCLient.del).bind(redisCLient)
			console.log("            - Delete Created")
		})

		return redisCLient
	})
}


exports.setJson = async (key, value) => {
	try {
		console.log("Setting JSON -----------------")
		console.log(key)
		console.log(value)
		if (!value) return
		if (!redisCLient) {
			throw new Error('REdis Connection Not Established');
		}
		await redisSet(key, JSON.stringify(value))
		
	} catch (error) {
		console.log(error)
	}
}

exports.getJson = async (key) => {
	try {
		const content = await redisGet(key)
		if (content) {
			console.log("CACHE HIT")
			console.log(content)
			return JSON.parse(content)
		}
		console.log("CACHE MISS")
		
		return null
	} catch (error) {
		console.log(error)
	}
}


exports.getStockTranstionRedisKey = (id) => {
	return `ST${id}`
}
exports.getWalletTranstionRedisKey = (id) => {
	return `WT${id}`
}

exports.getUserBalanceRedisKey = (id) => {
	return `UB${id}`
}

exports.getUserPortfolioRedisKey = (user_id, stock_id) => {
	return `UP${user_id}${stock_id}`
}

exports.getStockRedisKey = (id) => {
	return `S${id}`
}





exports.fetchPortfolio = async (user_id, stock_id) => {
	const key = this.getUserPortfolioRedisKey(user_id, stock_id)
	let data = await this.getJson(key);
	if (data) return data

	data = await modelOperations.findOne(COLLECTIONS.PORTFOLIO, {user_id, stock_id})
	await this.setJson(key, data)
	return data
}

exports.fetchAllPortfoliosFromParams = async (params, sortBy = {}) => {
	return await modelOperations.findAll(COLLECTIONS.PORTFOLIO, params, sortBy)
}

exports.updatePortfolio = async (data) => {
	const key = this.getUserPortfolioRedisKey(data.user_id, data.stock_id)
	modelOperations.updateOneById(COLLECTIONS.PORTFOLIO, data._id, data);
	await this.setJson(key, data)
}

exports.createPortfolio = async (data) => {
	const key = this.getUserPortfolioRedisKey(data.user_id, data.stock_id);
	modelOperations.createOne(COLLECTIONS.PORTFOLIO, data);
	await this.setJson(key, data)
}



exports.fetchUserFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.USER, params)
	if (data) {
		const key = this.getUserBalanceRedisKey(data._id)
		this.setJson(key, data)
	}
	return data
}

exports.fetchUser = async (user_id) => {
	const key = this.getUserBalanceRedisKey(user_id)
	let data = await this.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.USER, user_id)
	this.setJson(key, data)
	return data
}

exports.updateUser = async (data) => {
	const key = this.getUserBalanceRedisKey(data._id)
	modelOperations.updateOneById(COLLECTIONS.USER, data._id, data);
	await this.setJson(key, data)
}


exports.createUser = async (data) => {
	const key = this.getUserBalanceRedisKey(data._id);
	modelOperations.createOne(COLLECTIONS.USER, data);
	await this.setJson(key, data)
}




exports.fetchStock = async (stock_id) => {
	const key = this.getStockRedisKey(stock_id)
	let data = await this.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.STOCK, stock_id)
	this.setJson(key, data)
	return data
}

exports.fetchAllStocks = async () => {
	return await modelOperations.findAll(COLLECTIONS.STOCK)
}

exports.fetchStockFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.STOCK, params)
	if (data) {
		const key = this.getStockRedisKey(data._id)
		this.setJson(key, data)
	}
	return data
}


exports.createStock = async (data) => {
	const key = this.getStockRedisKey(data._id);
	modelOperations.createOne(COLLECTIONS.STOCK, data);
	await this.setJson(key, data)
}

exports.updateStock = async (data) => {
	const key = this.getStockRedisKey(data._id)
	modelOperations.updateOneById(COLLECTIONS.STOCK, data._id, data);
	await this.setJson(key, data)
}



exports.fetchStockTransaction = async (stockTxId) => {
	const key = this.getStockTranstionRedisKey(stockTxId)
	let data = await this.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.STOCK_TRANSACTION, stockTxId)
	this.setJson(key, data)
	return data
}

exports.fetchAllStockTransactionFromParams = async (params, sortBy = {}) => {
	return await modelOperations.findAll(COLLECTIONS.STOCK_TRANSACTION, params, sortBy)
}

exports.fetchStockTransactionFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.STOCK_TRANSACTION, params)
	if (data) {
		const key = this.getStockTranstionRedisKey(data._id)
		this.setJson(key, data)
	}
	return data
}

exports.updateStockTransaction = async (data) => {
	const key = this.getStockTranstionRedisKey(data._id)
	modelOperations.updateOneById(COLLECTIONS.STOCK_TRANSACTION, data._id, data);
	await this.setJson(key, data)
}

exports.createStockTransaction = async (data) => {
	const key = this.getStockTranstionRedisKey(data._id)
	modelOperations.createOne(COLLECTIONS.STOCK_TRANSACTION, data);
	await this.setJson(key, data)
}




exports.fetchWalletTransaction = async (walletTxId) => {
	const key = this.getWalletTranstionRedisKey(walletTxId)
	let data = await this.getJson(key);
	if (data) return data

	data = await modelOperations.findById(COLLECTIONS.WALLET_TRANSACTION, walletTxId)
	this.setJson(key, data)
	return data
}

exports.fetchWalletTransactionFromParams = async (params) => {
	const data = await modelOperations.findOne(COLLECTIONS.WALLET_TRANSACTION, params)
	if (data) {
		const key = this.getWalletTranstionRedisKey(data._id)
		this.setJson(key, data)
	}
	return data
}

exports.fetchAllWalletTransactionFromParams = async (params, sortBy = {}) => {
	return await modelOperations.findAll(COLLECTIONS.WALLET_TRANSACTION, params, sortBy)
}


exports.updateWalletTransaction = async (data) => {
	const key = this.getWalletTranstionRedisKey(data._id)
	await modelOperations.updateOneById(COLLECTIONS.WALLET_TRANSACTION, data._id, data);
	await this.setJson(key, data)
}

exports.createWalletTransaction = async (data) => {
	const key = this.getWalletTranstionRedisKey(data._id);
	modelOperations.createOne(COLLECTIONS.WALLET_TRANSACTION, data);
	await this.setJson(key, data)
}

exports.deleteWalletTransaction = async (walletTxId) => {
	if (this.fetchWalletTransaction(walletTxId)) {
		this.redisDelete(key)
	}
	modelOperations.deleteById(walletTxId)

}




