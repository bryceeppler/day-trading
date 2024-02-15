const mongoose = require('mongoose');

const connectDB = async (customURI) => {
  const mongoUri = customURI || process.env.MONGO_URI;
  try {
    await mongoose.connect(mongoUri, { authSource: "admin" });
    console.log("Database connected...");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
