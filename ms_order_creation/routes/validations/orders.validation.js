const { param, body, query, check } = require('express-validator');
const { validate } = require('../../shared/middleware/base.validation');
const { ORDER_TYPE } = require('../../shared/lib/enums');

exports.placeStockOrder = validate([
  body('stock_id').notEmpty().isMongoId(),
  check('is_buy').isBoolean().notEmpty(),
	check('order_type').isIn(Object.values(ORDER_TYPE)),
  body('quantity').notEmpty().isInt(),
	body('price')
    .custom((value, { req }) => {
      const orderType = req.body.order_type;
      if (orderType === ORDER_TYPE.LIMIT && (value === null || isNaN(value) || value <= 0)) {
        throw new Error('Price for LIMIT order must be greater than 0.');
      } else if (orderType === ORDER_TYPE.MARKET && value !== null ){
        throw new Error('Price cannot be given for MARKET orders');
      }
      return true;
    }),
]);

exports.cancelStockTransaction = validate([
  body('stock_tx_id').notEmpty().isMongoId()
]);