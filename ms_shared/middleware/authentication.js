const jwt = require('jsonwebtoken');
const { errorReturn } = require('../lib/apiHandling');
const { STATUS_CODE } = require('../lib/enums');

exports.authenticateToken = (accessToken) => async (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')?.[1];
  if (!token) return errorReturn(res, "Unauthorized", STATUS_CODE.UNAUTHORIZED);

  jwt.verify(token, accessToken, (error, user) =>
  {
    if (error) return errorReturn(res, "Unauthorized", STATUS_CODE.UNAUTHORIZED);
    req.user = user;
    req.token = token;
    next();
  });
};
