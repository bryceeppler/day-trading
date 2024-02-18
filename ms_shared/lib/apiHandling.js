exports.createError = (message = 'Error Performing Action', statusCode = 500) =>
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

exports.successReturn = (res, data, successFlag) =>
{
  const response = {
    success: successFlag ?? true,
    data: data ?? null
  }
  return res.status(200).send(response)
};