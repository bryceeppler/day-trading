const { body, query, check } = require('express-validator');
const { validate } = require('./base.validation');


exports.validate = (validations) => {
    return async (req, res, next) => {
      await Promise.all(validations.map((validation) => validation.run(req)));
      const errors = validationResult(req);
      if (errors.isEmpty()) return next();
      return res.status(401).json({message: errors.array()});
    };
  };

exports.createStockValidation = validate([
    body('stock_name').notEmpty().withMessage('Stock name is required')
    .isString().withMessage('invalid stock name format')
]);

exports.getStockPricesValidation = [
    query('stock_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format'),
];

exports.getAllStocksValidation = validate([
    body().isEmpty().withMessage('Request body must be empty')
]);

const isPositive = (value) => {
    return value >= 0;
  };

exports.updateStockPriceValidation = validate([
param('stock_id').notEmpty().withMessage('Stock ID is required')
.isMongoId().withMessage('Invalid stock ID format'),
body('new_price').notEmpty().withMessage('New price is required')
.isNumeric().withMessage('New price must be a number')
.custom(isPositive).withMessage('New price must be positive'),
]);