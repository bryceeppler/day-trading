const {
  handleError,
  successReturn,
  errorReturn,
} = require("../shared/lib/apiHandling");
const orderService = require("../services/orders.service");

exports.placeStockOrder = async (req, res, next) => {
  try {
    const is_buy = req.body.is_buy;
    const token = req.token;
    const orderDetails = {
      user_id: req.user?.userId,
      stock_id: req.body.stock_id,
      quantity: req.body.quantity,
      price: req.body.price,
      order_type: req.body.order_type,
      is_buy,
    };

    let error;
    if (is_buy) {
      error = await orderService.placeOrder(orderDetails, token);
    } else {
      error = await orderService.sellOrder(orderDetails, token);
    }

    if (error) {
      return errorReturn(res, error);
    }
    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};

exports.cancelStockTransaction = async (req, res, next) => {
  try {
    const params = {
      stock_tx_id: req.body.stock_tx_id,
    };

    await orderService.cancelStockTransaction(params, req.token);

    successReturn(res);
  } catch (error) {
    handleError(error, res, next);
  }
};
