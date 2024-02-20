const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;
const User = require('../models/User');

async function getWalletBalance(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            console.log(req.headers.authorization);
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.userId;

        if (!userId) {
            return res.status(400).json({ message: "Invalid token: User ID not found" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (typeof user.balance !== 'number') { // Ensures balance exists and is a number
            return res.status(404).json({ message: "Balance not found" });
        }

        const balance = user.balance;
        return res.status(200).json({ success: true, data: { balance } });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        console.error('Error getting user balance:', error);
        return res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
}

module.exports = {
    getWalletBalance
};