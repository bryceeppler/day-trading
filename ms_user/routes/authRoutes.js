const express = require('express');
const User = require('../shared/models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Username and password validation functions
const validateUsername = (username) =>
{
  // Check if username has more than 8 characters and doesn't contain special characters
  const usernameRegex = /^[a-zA-Z0-9_. ]+$/;
  return username.length > 8 && usernameRegex.test(username);
};

const validatePassword = (password) =>
{
  // Check if password doesn't contain spaces and length is at least 6
  return !password.includes(' ') && password.length >= 6;
};

const validateName = (name) =>
{
  // Check if name is provided and contains only letters and spaces
  const nameRegex = /^[a-zA-Z0-9_. !@-]+$/; 
  return name.trim().length > 0 && nameRegex.test(name);
};

// Login route
router.post('/login', async (req, res) =>
{
  try
  {
    const { user_name, password } = req.body;
    const userName = user_name.trim();
    let user = await User.findOne({  user_name: userName });
    if (!user) {
      return res.status(200).json({ success: false, data: {error: 'User does not exist'}});
    }
    // Compare the plaintext password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).json({ success: false, data: {error: 'Invalid Credentials'}});
    }

    const token = jwt.sign({ userId: user._id, user_name: user.user_name, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ success: true, data: { token } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, data: {error: 'Server error' }});
  }
});

// Register route
router.post('/register', async (req, res) =>
{
  try
  {
    const { user_name, password, name } = req.body;
     // Validate username
    if (!validateUsername(user_name)) {
      return res.status(200).json({ success: false, data: {error: 'Username must have more than 8 characters and only contain letters, numbers, or underscores' }});
    }

    // Validate password
    if (!validatePassword(password)) {
      return res.status(200).json({ success: false, data: {error: 'Password must be at least 6 characters long and should not contain spaces' }});
    }

    // Validate name
    if (!validateName(name)) {
      return res.status(200).json({ success: false, data: {error: 'Name is required and should only contain letters' }});
    }

    const existingUser = await User.findOne({ user_name });
    if (existingUser) {
      return res.status(200).json({success: false, data: {error: 'User already exists'}});
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);
    let hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ user_name, password: hashedPassword, name, balance:0 });
    await newUser.save();

    // Respond with success true and data containing user details
    res.status(200).json({ success: true, data: null });
  } catch (error)
  {
    console.error(error);
    res.status(500).json({ success: false, data: {error: 'Server error' }});
  }
});

module.exports = router;