const { body, query, check, param, validationResult } = require('express-validator');


const validate = (validations) =>
{
  return async (req, res, next) =>
  {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(422).json({ message: errors.array() });
  };
};

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