const { body, query, check, param } = require('express-validator');
const { validate } = require('../../shared/middleware/base.validation');


exports.createWalletTxValidation = validate([
  body('user_id').notEmpty().withMessage('user_id is required')
    .isMongoId().withMessage('Invalid user ID format'),
  body('is_debit').notEmpty().withMessage('Is debit is required')
    .isBoolean().withMessage('is_debit must be a boolean'),
  body('amount').notEmpty().withMessage('amount is required')
    .isNumeric().withMessage('amount must be a number')
    .custom(value => value >= 1).withMessage('amount must be positive')
]);


exports.updateWalletTxValidation = validate([
  param('wallet_tx_id').notEmpty().withMessage('Wallet transaction ID is required')
    .isMongoId().withMessage('Invalid wallet transaction ID format'),
  body('stock_tx_id').notEmpty().withMessage('New price is required')
    .isMongoId().withMessage('Invalid wallet transaction ID format')
]);

exports.deleteWalletTxValidation = validate([
  param('wallet_tx_id').notEmpty().withMessage('Stock ID is required')
    .isMongoId().withMessage('Invalid stock ID format')
]);


