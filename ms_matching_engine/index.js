var express = require("express");
var app = express();

const mongoose = require("mongoose");
const Orderbook = require("./orderbook.js");

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, {
  authSource: "admin",
}).then(() => console.log("MongoDB connected using Mongoose"))
  .catch(err => console.error("MongoDB connection error:", err));


  // import models from ./models/stockTransactionModel.js

  const StockTransaction = require('./models/stockTransactionModel');




// const orderbook = new Orderbook(db);

app.get("/", (req, res) => {
  res.send("This is the matching engine microservice");
});

app.get("/healthcheck", async (req, res) => {
  console.log("mongo uri", mongoUri)
  try {
    const connectionState = mongoose.connection.readyState;

    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (connectionState === 1) {
      res.send("MongoDB connection is healthy");
    } else {
      throw new Error("MongoDB connection is not healthy");
    }
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).send("Health check failed: Unable to connect to MongoDB");
  }
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Matching engine microservice on port ${port}...`);
});
