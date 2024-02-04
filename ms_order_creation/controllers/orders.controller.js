const { handleError, successReturn } = require('../lib/apiHandling');
const orderService = require('../services/orders.service')

exports.placeStockOrder = async (req, res, next) => {
  try {
		const is_buy = req.body.is_buy;

		const orderDetails =  {
			stock_id: req.body.stock_id,
			quantity: req.body.quantity,
			price: req.body.price,
			account_id: req.user?.account_id || 2,
			order_type: req.body.order_type
		}

		if (is_buy) {
			orderService.placeOrder(orderDetails)
		} else {
			orderService.sellOrder(orderDetails)
		}

		
		  
    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.cancelStockTransaction = async (req, res, next) => {
  try {
		const params =  {
			stock_tx_id: req.body.stock_tx_id,
			account_id: req.user.account_id
		}

		orderService.cancelStockTransaction(params)
		  
    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};