const jwt = require('jsonwebtoken');
const { handleError, createError } = require('../lib/apiHandling');
const { STATUS_CODE } = require('../lib/enums');

module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // More robust check for existence

  if (!token) {
    // Directly use your custom error handling
    return handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      // Possible errors: token expired, invalid token, etc.
      return handleError(createError("Unauthorized", STATUS_CODE.UNAUTHORIZED), res, next);
    }
    req.user = decoded; // Assuming the decoded token contains user info
    next();
  });
};
