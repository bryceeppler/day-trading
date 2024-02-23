import mongoose from "mongoose";
import { Request, Response } from "express";

import OrderBook from "../services/orderbook";
import { Order, MatchedOrder, OrderBookOrder } from "../types";

interface Routes {
  healthCheck: (req: Request, res: Response) => Promise<void>;
  receiveOrder: (req: Request, res: Response) => Promise<void>;
  cancelOrder: (req: Request, res: Response) => Promise<void>;
  checkOrders: (req: Request, res: Response) => Promise<void>;
  sendTestToExecutionService: (req: Request, res: Response) => Promise<void>;
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
        res
          .status(500)
          .send("Health check failed: Unable to connect to MongoDB");
      }
    },

    receiveOrder: async (req: Request, res: Response): Promise<void> => {
      try {
        const order: Order = req.body;
        res.status(200).send("Order received");

        const orderBookOrder: OrderBookOrder = {
          ...order,
          timestamp: new Date(),
          executed: false,
        };

        console.log("Orderbook Order:", orderBookOrder);
        const [matched_orders, remainingQuantity]: [MatchedOrder[], number] =
          orderBook.matchOrder(orderBookOrder);
        console.log("Order matching done.");
        console.log("Matched orders: ", matched_orders.length);
        console.log("Flushing to execution service...");
        orderBook.flushOrders();
      } catch (error) {
        // TODO: better err handling
        console.error("Error processing order:", error);
        res.status(500).send("Error processing order");
      }
    },

    cancelOrder: async (req: Request, res: Response): Promise<void> => {
      try {
        const orderToCancel: CancelOrderRequest = req.body;
        // console.log("Current orders in order book:", orderBook.getOrderBookState());
        const result = orderBook.cancelOrder(orderToCancel.stock_tx_id);
        if (result) {
          console.log(`Order ${orderToCancel.stock_tx_id} cancelled.`)
          res.status(200).send("Order cancelled");
          orderBook.flushOrders();
        } else {
          console.log("Order not found");
          res.status(404).send("Order not found");
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).send("Error cancelling order");
      }
    },

    checkOrders: async (req: Request, res: Response): Promise<void> => {
      // report the current state of the order book
      try {
        const orderBookState = orderBook.getOrderBookState();
        res.status(200).send(orderBookState);
      } catch (error) {
        console.error("Error checking orders:", error);
        res.status(500).send("Error checking orders");
      }
    },

    sendTestToExecutionService: async (
      req: Request,
      res: Response,
    ): Promise<void> => {
      orderBook.sendTestToExecutionService();
      res.status(200).send("Test sent to execution");
    },
  };
};
