import express from "express";
import connectDB from "./services/database";
import matchingRoutes from './routes/matchingRoutes';
import OrderBook from './services/orderbook';
import {StockTransaction} from './models/stockTransactionModel';
import morgan from 'morgan';

console.log('Initializing order book...');
const orderBook = new OrderBook(StockTransaction);
// orderBook.initializeOrderBook();

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

setInterval(() => {
  orderBook.checkForExpiredOrders();
  orderBook.flushOrders();
}, 10000); // every 10 sec for now
