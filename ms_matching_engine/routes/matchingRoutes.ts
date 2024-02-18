import express, { Router, Request, Response } from 'express';
import OrderBook from '../services/orderbook'; // Adjust the path to where your OrderBook class is defined
import orderControllerConstructor from '../controllers/matchingController';

export default function(orderBook: OrderBook): Router {
  const router = express.Router();
  const orderController = orderControllerConstructor(orderBook);

  router.get('/', (req: Request, res: Response) => {
    res.send('This is the matching engine microservice');
  });
  
  router.get('/healthcheck', orderController.healthCheck);
  router.post('/receiveOrder', orderController.receiveOrder);

  return router;
}