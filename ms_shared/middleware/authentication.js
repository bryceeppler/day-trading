const jwt = require('jsonwebtoken');

exports.authenticateToken = (accessToken) => async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')?.[1];
  if (!token) return res.status(401).send("Unauthorized");
  
  jwt.verify(token, accessToken, (error, user) => {
    if (error) return res.status(401).send("Unauthorized");
    req.user = user;
		req.token = token;
    next();
  });
};