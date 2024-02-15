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

// Username and password validation functions
const validateUsername = (username) => {
  // Check if username has more than 8 characters and doesn't contain special characters
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  return username.length > 8 && usernameRegex.test(username);
};

const validatePassword = (password) => {
  // Check if password doesn't contain spaces and length is at least 6
  return !password.includes(' ') && password.length >= 6;
};

const validateName = (name) => {
  // Check if name is provided and contains only letters and spaces
  const nameRegex = /^[a-zA-Z]+$/;
  return name.trim().length > 0 && nameRegex.test(name);
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { user_name, password } = req.body;
    let user = await User.findOne({ user_name });
    if (!user) {
      return res.status(400).json({ success: false, data: null, message: 'User does not exist'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(password);
      console.log(user.password);
      return res.status(400).json({ success: false, data: null, message: 'Invalid credentials'});
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ success: true, data: { id: user._id, user_name: user.user_name, name: user.name }, token });
  } catch (error) {
    res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { user_name, password, name } = req.body;

     // Validate username
    if (!validateUsername(user_name)) {
      return res.status(400).send('Username must have more than 8 characters and only contain letters, numbers, or underscores');
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(400).send('Password must be at least 6 characters long and should not contain spaces');
    }

    // Validate name
    if (!validateName(name)) {
      return res.status(400).send('Name is required and should only contain letters');
    }

    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ user_name, password: hashedPassword, name });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id, id: newUser._id, user_name: newUser.user_name, password: newUser.password, name: newUser.name }, process.env.JWT_SECRET);
    // Respond with success true and data containing user details
    res.status(201).json({ success: true, data: { id: newUser._id, user_name: newUser.user_name, password: newUser.password, name: newUser.name }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: null, message: 'Server error' });
  }
});

module.exports = router;