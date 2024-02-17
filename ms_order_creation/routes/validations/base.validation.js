const { handleError, createError } = require('../../lib/apiHandling');
const { validationResult, body } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    const error = createError('Missing information', 401);
    handleError(error, res, next);
  };
};
