import mongoose from 'mongoose';
import { Request, Response } from 'express';

import OrderBook from '../services/orderbook';
import { Order, MatchedOrder } from '../types';

interface Routes {
  healthCheck: (req: Request, res: Response) => Promise<void>;
  receiveOrder: (req: Request, res: Response) => Promise<void>;
}

export default (orderBook: OrderBook): Routes => {
  return {
    healthCheck: async (req: Request, res: Response): Promise<void> => {
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

    receiveOrder: async (req: Request, res: Response): Promise<void> => {
      try {
        const order: Order = req.body; // TODO: validate order
        res.status(200).send("Order received");

        const [matched_orders, remainingQuantity]: [MatchedOrder[], number] = orderBook.matchOrder(order);
        // orderBook.flushOrders();        // send expired/matched orders to order execution service
    
      } catch (error) {
        // TODO: better err handling
        console.error("Error processing order:", error);
        res.status(500).send("Error processing order");
      }
    },

  };
};