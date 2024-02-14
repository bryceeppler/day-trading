// In a single file (e.g., authRoutes.js), define routes for 
// registration and login. Use bcrypt to hash passwords before
// saving them during registration, and compare submitted 
// passwords during login. On successful login, generate a 
// JWT token with jsonwebtoken.

const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { user_name, password } = req.body;
    let user = await User.findOne({ user_name });
    if (!user) {
      return res.status(400).send('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { user_name, password, name } = req.body;
    let user = await User.findOne({ user_name });
    if (user) {
      return res.status(400).send('User already exists');
    }
    user = new User({ user_name, password, name });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ token });
  } catch (error) {
    console.log(error)
    res.status(500).send('Server error');
  }
});

module.exports = router;