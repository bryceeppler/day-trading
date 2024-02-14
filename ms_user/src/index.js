const express = require("express");
const app = express();
require('dotenv').config(); // To use environment variables

// Middleware to parse request bodies
app.use(express.json());

// Database connection setup (assuming you have a 'connectDB.js' in the 'config' directory)
const connectDB = require("../config/database");
connectDB();

// Import routes
const authRoutes = require("../routes/authRoutes");

// Use routes
app.use("/", authRoutes);

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