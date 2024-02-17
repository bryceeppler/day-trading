const express = require("express");
const app = express();
const connectDB = require("./config/database");
const matchingRoutes = require('./routes/matchingRoutes');
const OrderBook = require('./services/orderbook');
const StockTransaction = require('../shared/models/stockTransactionModel');

console.log('Initializing order book...');
const orderBook = new OrderBook(StockTransaction);
orderBook.init();

console.log('Connecting to database...');
connectDB();

app.use(express.json());
app.use('/', matchingRoutes(orderBook)); // Pass the orderBook instance

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Matching engine microservice on port ${port}...`);
});

// periodically check for expired orders and notify order exec service
setInterval(() => {
  orderBook.checkForExpiredOrders();
  // orderBook.flushOrders();
}, 60000); // every 60 sec for now