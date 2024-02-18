import express from "express";
import connectDB from "./services/database";
import matchingRoutes from './routes/matchingRoutes';
import OrderBook from './services/orderbook';
import {StockTransaction} from './models/stockTransactionModel';
import morgan from 'morgan';
// Having issues importing from the shared volume
// const StockTransaction = require('../shared/models/stockTransactionModel');

console.log('Initializing order book...');
const orderBook = new OrderBook(StockTransaction);
orderBook.initializeOrderBook();

console.log('Connecting to database...');
connectDB();

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use('/', matchingRoutes(orderBook));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Matching engine microservice on port ${port}...`);
});

// periodically check for expired orders and notify order exec service
setInterval(() => {
  orderBook.checkForExpiredOrders();
  // orderBook.flushOrders();
}, 60000); // every 60 sec for now
