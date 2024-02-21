const { STATUS_CODE } = require("./enums");



exports.errorReturn = (res, message, code) =>
{
  const response = {
    success: false,
    data: { error: message }
  }
  const statusCode = code ?? STATUS_CODE.OK;
  return res.status(statusCode).send(response)
};

exports.createError = (message = 'Error Performing Action', statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR) =>
{
  const response = {
    success: false,
    data: { error: message }
  }
  const error = new Error(message);
  error.details = {
    response,
    statusCode,
  };
  return error;
};

exports.handleError = (error, res, next) =>
{
  return error.details ? res.status(error.details.statusCode).send(error.details.response) : next(error);
};

exports.successReturn = (res, data, code) =>
{
  const response = {
    success: true,
    data: data ?? null
  }
  const statusCode = code ?? STATUS_CODE.OK;
  return res.status(statusCode).send(response)
};
