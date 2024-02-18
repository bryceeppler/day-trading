const { param, body, query, check } = require('express-validator');
const { validate } = require('./base.validation');

exports.placeStockOrder = validate([
  body('stock_id').notEmpty().isString(),
  check('is_buy').isBoolean().notEmpty(),
	check('order_type').isIn(['LIMIT', 'MARKET']),
  body('quantity').notEmpty().isInt(),
  body('price').notEmpty().isDecimal(),
]);

exports.cancelStockTransaction = validate([
  body('stock_tx_id').notEmpty().isString()
]);