const express = require("express");
const env = require('dotenv').config();

const app = express();

// Middleware to parse request bodies
app.use(express.json());

// Database connection setup (assuming you have a 'connectDB.js' in the 'config' directory)
const connectDB = require("../config/database");
connectDB();

// Import routes
const authRoutes = require("../routes/authRoutes");
const transactionRoutes = require("../routes/transactionRoutes");
const userRoutes = require("../routes/userRoutes");

// Use routes
app.use("/", authRoutes);
app.use("/", transactionRoutes);
app.use('/', userRoutes); 

// Simple route for health check
app.get("/healthcheck", async (req, res) => {
  res.send("mongodb OK");
});

// Home route
app.get("/", (req, res) => {
  res.send("This is the user microservice");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User microservice running on port ${PORT}...`);
});