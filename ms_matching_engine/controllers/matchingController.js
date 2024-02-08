const Orderbook = require('../services/orderbook');
const mongoose = require('mongoose');
const orderbook = new Orderbook();

exports.healthCheck = async (req, res) => {
  console.log("mongo uri", process.env.MONGO_URI);
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
};

exports.limitOrderTrigger = async (req, res) => {
  try {
    // I don't actually need any information fromt the request for now, it just triggers a search for matching orders.
    await orderbook.loadOrders();   // load orders from db
    orderbook.matchOrders();        // run matching algorithm
    await orderbook.saveOrders();   // save to db
    res.status(200).send("Limit order trigger received");
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).send("Error processing order");
  }
};

exports.marketOrderTrigger = async (req, res) => {
  try {
    res.status(200).send("Market order trigger received");
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).send("Error processing order");
  }
}
