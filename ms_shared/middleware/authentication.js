const jwt = require('jsonwebtoken');
const { STATUS_CODE } = require('../lib/enums');
const { handleError, createError } = require('../lib/apiHandling');

exports.authenticateToken = (accessToken) => async (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')?.[1];
  if (!token) handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);

  jwt.verify(token, accessToken, (error, user) =>
  {
    if (error) handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);
    req.user = user;
    req.token = token;
    next();
  });
};