const express = require('express');
const User = require('../shared/models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

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

module.exports = router;