
const base = require('./base.model')

const { COLLECTIONS } = require('../shared/models/baseModel');

exports.fetchPortfolio = ({userId, stockId}) => {
	return base.findOne(COLLECTIONS.PORTFOLIO, {user_id: userId, stock_id: stockId})
}

exports.fetchBalance = (user_id) => {

	return base.findById(COLLECTIONS.USER, user_id)
}

exports.updateBalance = (user_id, balance) => {
	return base.updateOneById(COLLECTIONS.USER, user_id, {balance})
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

