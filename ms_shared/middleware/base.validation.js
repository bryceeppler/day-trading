const { handleError, createError } = require('../lib/apiHandling');
const { STATUS_CODE } = require('../lib/enums');
const { validationResult, body } = require('express-validator');

exports.validate = (validations) =>
{
  return async (req, res, next) =>
  {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const error = createError(errors.array(), STATUS_CODE.OK);
    handleError(error, res, next);
  };
};