const Orderbook = require('../services/orderbook');
const mongoose = require('mongoose');

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

exports.orderTrigger = async (req, res) => {
  try {
    // I don't actually need any information fromt the request here, it just triggers a search for matching orders.
    // orderbook.loadOrders();
    // populate orderbook buyOrders and sellOrders from db

    // orderbook.matchOrders();
    // run fifo matching algorithm, populate matchedOrders

    // orderbook.saveOrders();
    // write updated orders to db

    // return success 
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).send("Error processing order");
  }
};
