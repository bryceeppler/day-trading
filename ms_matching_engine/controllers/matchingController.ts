import mongoose from 'mongoose';
import { Request, Response } from 'express';

import OrderBook from '../services/orderbook';
import { Order, MatchedOrder, OrderBookOrder } from '../types';

interface Routes {
  healthCheck: (req: Request, res: Response) => Promise<void>;
  receiveOrder: (req: Request, res: Response) => Promise<void>;
  cancelOrder: (req: Request, res: Response) => Promise<void>;
}

interface CancelOrderRequest {
  stock_tx_id: string;
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
        const order: Order = req.body; 
        res.status(200).send("Order received");

        const orderBookOrder:OrderBookOrder = {
          ...order,
          timestamp: new Date()
        };

        const [matched_orders, remainingQuantity]: [MatchedOrder[], number] = orderBook.matchOrder(orderBookOrder);
        orderBook.flushOrders();
    
      } catch (error) {
        // TODO: better err handling
        console.error("Error processing order:", error);
        res.status(500).send("Error processing order");
      }
    },

    cancelOrder: async (req: Request, res: Response): Promise<void> => {
      try {
        const orderToCancel: CancelOrderRequest = req.body.stock_tx_id; 
        const result = orderBook.cancelOrder(orderToCancel.stock_tx_id);
        if (result) {
          res.status(200).send("Order cancelled");
        } else {
          res.status(404).send("Order not found");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).send("Error cancelling order");
      }
    }

  };
};