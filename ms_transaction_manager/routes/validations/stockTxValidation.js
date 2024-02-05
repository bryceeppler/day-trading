const { body, query, check, param } = require('express-validator');
const { validate } = require('./baseValidation')
const { ORDER_TYPE, ORDER_STATUS } = require('../../lib/enums')


exports.createStockTxValidation = validate([
  body('stock_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format'),
  body('wallet_tx_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format'),
  body('is_buy').notEmpty().withMessage('is_buy is required')
    .isBoolean().withMessage('Invalid is_buy format'),
  body('order_type').notEmpty().withMessage('Order type is required')
    .isIn(Object.values(ORDER_TYPE)).withMessage('Order type must be LIMIT or MARKET'),
  body('stock_price').notEmpty().withMessage('Stock price is required')
    .isNumeric().withMessage('stock price must be a number')
    .custom(value => value >= 0).withMessage('stock must be positive'),
  body('quantity').notEmpty().withMessage('Quantity is required')
    .isNumeric().withMessage('Quantity must be a number')
    .custom(value => value >= 1).withMessage('Quantity must be at least 1'),
]);


exports.updateStockTxStatusValidation = validate([
  param('stock_tx_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format'),
  body('order_status').notEmpty().withMessage('New price is required')
    .isIn(Object.values(ORDER_STATUS)).withMessage('Order type must be IN_PROGRESS, CANCELED, or COMPLETED')
]);

exports.deleteStockTxValidation = validate([
  param('stock_tx_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format')
]);


