const { handleError, successReturn } = require('../lib/apiHandling');
const orderService = require('../services/orders.service')

exports.placeStockOrder = async (req, res, next) => {
  try {
		const is_buy = req.body.is_buy;
		const token = req.token;
		const orderDetails =  {
			user_id: req.user?.userId || "65d051e3273e059d8c4587b4",
			stock_id: req.body.stock_id,
			quantity: req.body.quantity,
			price: req.body.price,
			order_type: req.body.order_type,
			is_buy
		}

		if (is_buy) {
			await orderService.placeOrder(orderDetails, token)
		} else {
			await orderService.sellOrder(orderDetails, token)
		}

		
		  
    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.cancelStockTransaction = async (req, res, next) => {
  try {
		const params =  {
			stock_tx_id: req.body.stock_tx_id
		}

		await orderService.cancelStockTransaction(params, req.token)
		  
    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};