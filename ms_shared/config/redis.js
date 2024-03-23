
const redis = require('redis');
const { promisify } = require('util')


let redisCLient;
let redisGet
let redisSet
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
		})

		return redisCLient
	})
}


exports.setJson = async (key, value) => {
	try {
		console.log("Setting JSON -----------------")
		console.log(key)
		console.log(value)
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