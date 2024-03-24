const express = require("express");
const env = require('dotenv').config();
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
const connectDB = require("../config/database");
connectDB();

const authRoutes = require("../routes/authRoutes");

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("This is the authentication microservice");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth microservice running on port ${PORT}...`);
});