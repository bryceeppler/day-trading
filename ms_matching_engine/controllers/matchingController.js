const mongoose = require('mongoose');

module.exports = (orderBook) => {
  return {
    healthCheck: async (req, res) => {
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
        res.status(200).send("Order received");

        const match_found = orderBook.matchOrder(order);

        if (match_found) {
          // send matched order to order execution service
      
        } else {
          if (is_limit_order) {
            // add to orderBook
          } else {
            // notify order execution service
          }
        }
        // orderBook.insertOrder(order);
  
        // // Order received and in orderBook, return 200 to order creation service

        // orderBook.matchOrders();        // run matching algorithm
        // orderBook.flushOrders();        // send expired/matched orders to order execution service
    
      } catch (error) {
        // TODO: better err handling
        console.error("Error processing order:", error);
        res.status(500).send("Error processing order");
      }
    },

  };
};