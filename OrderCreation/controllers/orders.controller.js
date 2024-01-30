const { handleError, successReturn } = require('../lib/apiHandling');
const orderService = require('../services/orders.service')

exports.placeStockOrder = async (req, res, next) => {
  try {

		const order_type = req.body.order_type
		const is_buy = req.body.is_buy;

		const orderDetails =  {
			stock_id: req.body.stock_id,
			quantity: req.body.quantity,
			price: req.body.price
		}

		if (order_type === "LIMIT" ) {
			orderService.placeLimitOrder(orderDetails)
		} else {
			orderService.placeMarketOrder(orderDetails)
		}
		  
    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};
