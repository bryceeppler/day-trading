import express from "express";
import connectDB from "./services/database";
import { connectToRabbitMQ } from "./services/rabbitmq";
import matchingRoutes from './routes/matchingRoutes';
import OrderBook from './services/orderbook';
import { StockTransaction } from './models/stockTransactionModel';
import morgan from 'morgan';
import { Order, MatchedOrder, OrderBookOrder, CancelOrderRequest, MessageQueue } from "./types";
import * as amqp from "amqplib/callback_api";

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

// setInterval(() => {
//   orderBook.checkForExpiredOrders();
//   orderBook.flushOrders();
// }, 10000); // every 10 sec for now

const receiveOrder = async (orderBook: OrderBook, order: Order): Promise<void> => {
  try {

    const orderBookOrder: OrderBookOrder = {
      ...order,
      timestamp: new Date(),
      executed: false,
    };

    const [matched_orders, remainingQuantity]: [MatchedOrder[], number] =
      orderBook.matchOrder(orderBookOrder);
    // console.log(`Matched ${matched_orders.length} orders, sending to execution service...`);
    orderBook.flushOrders();
  } catch (error) {
    // TODO: better err handling
    console.error("Error processing order:", error);
  }
};

const cancelOrder = async (orderBook: OrderBook, orderToCancel: CancelOrderRequest): Promise<void> => {
  try {
    // console.log("Current orders in order book:", orderBook.getOrderBookState());
    const result = orderBook.cancelOrder(orderToCancel.stock_tx_id);
    if (result) {
      // console.log(`Order ${orderToCancel.stock_tx_id} cancelled.`)
      await orderBook.flushOrders();
    } else {
      console.log("Order not found");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
  }
};


async function constantExpiryPoll() {
  while (true) {
    try {
      orderBook.checkForExpiredOrders();
      await orderBook.flushOrders();
      await new Promise(resolve => setTimeout(resolve, 200)); // 200ms (5 times per second)
    } catch (error) {
      console.error('Error during order polling: ', error);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}


async function RouteIncomingMessages() {
  connectToRabbitMQ()
    .then(({ connection, channel }) => {
      channel.assertQueue(MessageQueue.PLACE_ORDER, { durable: true });
      channel.consume(
        MessageQueue.PLACE_ORDER,
        async (data: amqp.Message | null) => {
          if (data) {
            const order: Order = JSON.parse(data.content.toString());
            // console.log("Recieved Place Order Message: ", order);
            receiveOrder(orderBook, order);
          }
        },
        { noAck: true }
      );

      channel.assertQueue(MessageQueue.CANCEL_ORDER, { durable: true });
      channel.consume(
        MessageQueue.CANCEL_ORDER,
        async (data: amqp.Message | null) => {
          if (data) {
            const orderToCancel: CancelOrderRequest = JSON.parse(data.content.toString());
            // console.log("Recieved Cancel Order Message: ", orderToCancel);
            cancelOrder(orderBook, orderToCancel);
          }
        },
        { noAck: true }
      );
    })
    .catch(error => {
      console.error('Error connecting to RabbitMQ:', error);
    });
}

constantExpiryPoll();
RouteIncomingMessages();