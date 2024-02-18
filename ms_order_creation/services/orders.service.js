const { createError } = require('../lib/apiHandling');
const ordersModel = require('../models/orders.model')
const usersModel = require('../models/users.model')
const axios = require('../axios/base');
const config = require('../config/config');

exports.placeOrder = async (data, token) => {
	let previousBalance;
	let wallet_tx_id;
	let stock_tx_id;

	try {
		
		// Fetch User
		const userData = await usersModel.fetchBalance(data.user_id)
		if (userData === null) throw createError('Cannot find user', 401)

		// Check balance
		const balance = userData.balance
		if (balance < data.price) throw createError('Insufficient Funds', 401)

		// Update Balance in database
		await usersModel.updateBalance(data.user_id, balance - data.price)
		previousBalance = balance

		// Create a wallet transaction
		const walletTransactionData = {
			user_id: data.user_id,
			is_debit: true,
			amount: data.price
		}
		const createdWalletTx = await ordersModel.createWalletTransaction(walletTransactionData)
		wallet_tx_id = createdWalletTx._id

		// Create a stock transaction
		const stockTxData = {
			wallet_tx_id: wallet_tx_id,
			stock_id: data.stock_id,
			is_buy: data.is_buy,
			order_type: data.order_type,
			stock_price: data.price,
			quantity: data.quantity,
		}
		
		const createdStockTx = await ordersModel.createStockTransaction(stockTxData)
		stock_tx_id = createdStockTx._id

		// Send data to matching engine
		const matchingEngineData = {
			...data,
			wallet_tx_id,
			stock_tx_id
		}

		await axios.POST(`${config.mathingEngineUrl}/receiveOrder`, matchingEngineData, token)

	} catch (error) {
		console.error(error)
		const reverseError = await reversePlaceOrder(data.user_id, previousBalance, wallet_tx_id, stock_tx_id)
		if (reverseError) {
			throw reverseError
		}
		throw error.details ? error : createError("Error Placing Order")
	}
	
}

exports.sellOrder = async (data, token) => {

	let portfolio_id;
	let previousQuantityOwned;
	let stock_tx_id;
	try {

		// Find Portfolio
		const portfolio = await usersModel.fetchPortfolio({stockId: data.stock_id, userId: data.user_id})
		if (!portfolio) throw createError("Portfolio not found")
	  // Check for portfolio Quantity
		if (portfolio.quantity_owned < data.quantity) throw createError("Not enough owned stock")

		// Update the quantity
		await usersModel.updatePortfolioStockQuantity(portfolio._id, portfolio.quantity_owned - data.quantity)
		portfolio_id = portfolio._id
		previousQuantityOwned = portfolio.quantity_owned;

		// Create a stock transaction
		const stockTxData = {
			stock_id: data.stock_id,
			is_buy: data.is_buy,
			order_type: data.order_type,
			stock_price: data.price,
			quantity: data.quantity,
		}

		const createdStockTx = await ordersModel.createStockTransaction(stockTxData)
		stock_tx_id = createdStockTx._id

		const matchingEngineData = {
			...data,
			stock_tx_id
		}

		// Send data to matching engine
		await axios.POST(`${config.mathingEngineUrl}/receiveOrder`, matchingEngineData, token)

	} catch (error) {
		console.error(error)
		const reverseError = await reverseSellOrder(portfolio_id, previousQuantityOwned, stock_tx_id)
		if (reverseError) {
			throw reverseError
		}
		throw error.details ? error : createError("Error Selling Order")
	}
}

exports.cancelStockTransaction = async (data, token) => {
	try {

		await axios.POST(`${config.mathingEngineUrl}/cancelOrder`,data, token)

	} catch (error) {
		console.error(error)

		throw error.details ? error : createError("Error Selling Order")
	}
}





const reversePlaceOrder = async (userId, previousBalance, wallet_tx_id, stock_tx_id) => {
	try {
		if (previousBalance !== undefined)  {
			console.log(previousBalance)
			await usersModel.updateBalance(userId, previousBalance)
		}

		if (wallet_tx_id) {
			await ordersModel.deleteWalletTransaction(wallet_tx_id)
		}

		if (stock_tx_id) {
			await ordersModel.deleteStockTransaction(stock_tx_id)
		}

	} catch (error) {
		console.error(error)
		return createError("Error Placing Order - Reversing Data Failed")
	}
}


const reverseSellOrder = async (portfolioId, previousQuantityOwned, stock_tx_id) => {
	try {
		if (previousQuantityOwned)  {
			await usersModel.updatePortfolioStockQuantity(portfolioId, previousQuantityOwned)
		}

		if (stock_tx_id) {
			await ordersModel.deleteStockTransaction(stock_tx_id)
		}

	} catch (error) {
		console.error(error)
		return createError("Error Selling Order - Reversing Data Failed")
	}
}
