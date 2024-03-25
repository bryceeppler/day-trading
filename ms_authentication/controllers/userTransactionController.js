const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const User = require('../shared/models/userModel');

