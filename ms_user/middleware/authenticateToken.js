const jwt = require('jsonwebtoken');
const { handleError, createError } = require('../lib/apiHandling');
const { STATUS_CODE } = require('../lib/enums');
const atob = require('atob');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader?.split(' ')[1];

  if (!token) return handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);

  // Split the JWT token into its parts
  const parts = token.split('.');
  if (parts.length !== 3) return handleError(createError("Invalid token", STATUS_CODE.UNAUTHORIZED), res, next);

  // Decode the payload part of the token
  try {
    const payload = JSON.parse(atob(parts[1]));
    req.user = payload;
    req.token = token;
    next();
  } catch (error) {
    return handleError(createError("Invalid token", STATUS_CODE.UNAUTHORIZED), res, next);
  }
};


