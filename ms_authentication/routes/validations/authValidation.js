const { body, query, check, param, validationResult } = require('express-validator');
const { validate } = require('../../shared/middleware/base.validation');


exports.createStockValidation = validate([
  body('stock_name').notEmpty().withMessage('Stock name is required')
    .isString().withMessage('invalid stock name format')
]);