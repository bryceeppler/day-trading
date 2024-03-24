
const base = require('./base.model')
const { COLLECTIONS } = require('../shared/models/baseModel');
const redisCache = require("../shared/config/redis");

redisCache.connect();

exports.fetchWalletTransaction = async (id) => {
	const key = redisCache.getWalletTranstionRedisKey(user_id)
	const cachedData = await redisCache.getJson(key)
	if (cachedData) return cachedData
	const walletTransaction = await base.findById(COLLECTIONS.WALLET_TRANSACTION, id)
	redisCache.setJson(key, walletTransaction)
	return walletTransaction
}


exports.createWalletTransaction = async (data) => {
	const id = await base.createOne(COLLECTIONS.WALLET_TRANSACTION, [data])
	data._id = id
	await redisCache.setJson(redisCache.getWalletTranstionRedisKey(id), data)
	return id
}

exports.deleteWalletTransaction = (id) => {
	return base.deleteById(COLLECTIONS.WALLET_TRANSACTION, id)
}

exports.fetchStock = async (id) => {
	const key = redisCache.getStockRedisKey(id)
	const cachedData = await redisCache.getJson(key)

	if (cachedData) return cachedData

	const stock = await base.findById(COLLECTIONS.STOCK, id)
	redisCache.setJson(key, stock)
	return stock
}


exports.createStockTransaction = async (data) => {
	console.log("Create stock transaction -------")
	console.log(data)
	const id = await base.createOne(COLLECTIONS.STOCK_TRANSACTION, [data])
	data._id = id
	await redisCache.setJson(redisCache.getStockTranstionRedisKey(id), data)
	return id
}

exports.deleteStockTransaction = (id) => {
	return base.deleteById(COLLECTIONS.STOCK_TRANSACTION, id)
}

exports.updateStockTxId = async (wallet_tx_id, stock_tx_id) => {
	
	base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, wallet_tx_id, {stock_tx_id})

	const key = redisCache.getWalletTranstionRedisKey(wallet_tx_id)
	let savedContent = await redisCache.getJson(key)
	if (!savedContent) {
		savedContent = await this.fetchWalletTransaction(wallet_tx_id)
	}
	savedContent.stock_tx_id = stock_tx_id;
	return redisCache.setJson(key, savedContent)

}

exports.updateStockPrice = async (stock_id, new_price) =>
{	
	base.updateOneById(COLLECTIONS.STOCK, stock_id, { starting_price: new_price, current_price: new_price })

	const key = redisCache.getStockRedisKey(stock_id)
	let savedContent = await redisCache.getJson(key)
	if (!savedContent) {
		savedContent = await this.fetchStock(wallet_tx_id)
	}
	savedContent.starting_price = new_price;
	savedContent.current_price = new_price;

	return redisCache.setJson(key, savedContent)

}


/*

const base = require('./base.model')
const { COLLECTIONS } = require('../shared/models/baseModel');
const redisCache = require("../shared/config/redis");

redisCache.connect();



exports.fetchStock = async (id) => {
	const cachedData = await redisCache.getJson(redisCache.getStockRedisKey(id))
	if (cachedData) return cachedData

	const stock = await base.findById(COLLECTIONS.STOCK, id)
	redisCache.setJson(redisCache.getStockRedisKey(id), stock)
	return stock
}

exports.createStockTransaction = async (data) => {

	const id = base.createOne(COLLECTIONS.STOCK_TRANSACTION, data)

	const key = redisCache.getStockTranstionRedisKey(id)
	await redisCache.setJson(key, data)
	return id

}

exports.deleteStockTransaction = async (id) => {
	
	return base.deleteById(COLLECTIONS.STOCK_TRANSACTION, id)
}

exports.updateStockTxId = async (wallet_tx_id, stock_tx_id) => {
	
	base.updateOneById(COLLECTIONS.WALLET_TRANSACTION, wallet_tx_id, {stock_tx_id})

	const key = redisCache.getWalletTranstionRedisKey(wallet_tx_id)
	let savedContent = await redisCache.getJson(key)
	if (!savedContent) {
		savedContent = await this.fetchWalletTransaction(wallet_tx_id)
	}
	savedContent.stock_tx_id = stock_tx_id;
	return redisCache.setJson(key, savedContent)

}

exports.updateStockPrice = async (stock_id, new_price) =>
{	
	base.updateOneById(COLLECTIONS.STOCK, stock_id, { starting_price: new_price, current_price: new_price })

	const key = redisCache.redisCache.getStockRedisKey(stock_id)
	let savedContent = await redisCache.getJson(key)
	if (!savedContent) {
		savedContent = await this.fetchStock(wallet_tx_id)
	}
	savedContent.starting_price = new_price;
	savedContent.current_price = new_price;

	return redisCache.setJson(key, savedContent)

}


*/