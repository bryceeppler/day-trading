const { param, body, query, check } = require('express-validator');
const { validate } = require('../../shared/middleware/base.validation');

exports.placeStockOrder = validate([
  body('stock_id').notEmpty().isMongoId(),
  check('is_buy').isBoolean().notEmpty(),
	check('order_type').isIn(['LIMIT', 'MARKET']),
  body('quantity').notEmpty().isInt(),
	body('price')
    .custom((value, { req }) => {
      const orderType = req.body.order_type;
      if (orderType === 'LIMIT' && (value === null || isNaN(value) || value <= 0)) {
        throw new Error('Price for LIMIT order must be greater than 0.');
      }
      return true;
    }),
]);

exports.cancelStockTransaction = validate([
  body('stock_tx_id').notEmpty().isMongoId()
]);