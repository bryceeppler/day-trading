const jwt = require('jsonwebtoken');
const { errorReturn } = require('../lib/apiHandling');

exports.authenticateToken = (accessToken) => async (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')?.[1];
  if (!token) return errorReturn(res, "Unauthorized");

  jwt.verify(token, accessToken, (error, user) =>
  {
    if (error) return errorReturn(res, "Unauthorized");
    req.user = user;
    req.token = token;
    next();
  });
};