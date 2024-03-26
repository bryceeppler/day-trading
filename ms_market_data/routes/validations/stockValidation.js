const { body, param } = require('express-validator');
const { validate } = require('../../shared/middleware/base.validation');


const isPositive = (value) =>
{
  return value >= 0;
};

exports.createStockValidation = validate([
  body('stock_name').notEmpty().withMessage('Stock name is required')
    .isString().withMessage('invalid stock name format')
]);

exports.updateStockPriceValidation = validate([
  param('stock_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format'),
  body('new_price').notEmpty().withMessage('New price is required')
    .isNumeric().withMessage('New price must be a number')
    .custom(isPositive).withMessage('New price must be positive'),
]);

exports.stockNameValidation = validate([
  body('stock_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format'),
]);