const jwt = require('jsonwebtoken');
const config = require('../../config/config');

exports.authenticateToken = async (req, res, next) => {
  const token = req.headers['token'];
  if (!token) return res.status(401).send("Unauthorized");
  jwt.verify(token, config.jwt.accessTokenSecret, (error, user) => {
    if (error) return res.status(401).send("Unauthorized");
    req.user = user;
    req.token = token;
    next();
  });
};
