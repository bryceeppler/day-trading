const jwt = require('jsonwebtoken');
const { handleError, createError } = require('../lib/apiHandling');
const { STATUS_CODE } = require('../lib/enums');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);
    req.user = user;
    req.token = token;
    next();
  });
};