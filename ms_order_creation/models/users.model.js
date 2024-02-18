
const base = require('./base.model')

exports.fetchPortfolio = ({userId, stockId}) => {
	console.log({userId, stockId})
	return base.findOne(base.COLLECTIONS.PORTFOLIO, {user_id: userId, stock_id: stockId})
}

exports.fetchBalance = (user_id) => {
	return base.findById(base.COLLECTIONS.USERS, user_id)
}

exports.updateBalance = (user_id, balance) => {
	return base.updateOneById(base.COLLECTIONS.USERS, user_id, {balance})
}

exports.updatePortfolioStockQuantity = (id, quantity_owned) => {
	return base.updateOneById(base.COLLECTIONS.PORTFOLIO, id, {quantity_owned})
}

