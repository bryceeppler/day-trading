const mongoose = require('mongoose');

module.exports = (orderBook) => {
  return {
    healthCheck: async (req, res) => {
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
    },

    receiveOrder: async (req, res) => {
      try {
        const order = req.body; // TODO: validate order
        console.log("Received order:", order);
    
        orderBook.insertOrder(order);
    
        // Order received and in orderBook, return 200 to order creation service
        res.status(200).send("Order received");
    
        orderBook.matchOrders();        // run matching algorithm
        orderBook.flushOrders();        // send expired/matched orders to order execution service
    
      } catch (error) {
        // TODO: better err handling
        console.error("Error processing order:", error);
        res.status(500).send("Error processing order");
      }
    },

  };
};