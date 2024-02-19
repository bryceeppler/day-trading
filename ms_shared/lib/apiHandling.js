const { STATUS_CODE } = require("./enums");

exports.createError = (message = 'Error Performing Action', statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR) =>
{
  const error = new Error(message);
  error.details = {
    message,
    statusCode,
  };
  return error;
};

exports.handleError = (error, res, next) =>
{
  return error.details ? res.status(error.details.statusCode).send({ message: error.details.message }) : next(error);
};

exports.successReturn = (res, data, code, successFlag) =>
{
  const response = {
    success: successFlag ?? true,
    data: data ?? null
  }
  const statusCode = code ?? STATUS_CODE.OK;
  return res.status(statusCode).send(response)
};