import { Document, Model } from "mongoose";
// Document and Model are mongodb types
// Document represents literally a mongo docoument
// Model represents the schema of a collection

export enum OrderType {
  LIMIT = "LIMIT",
  MARKET = "MARKET",
}

export enum OrderStatus {
  IN_PROGRESS = "IN_PROGRESS",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

// we need a type that doesn't extend any mongoose types
export interface IStockTransaction {
  stock_id: string;
  wallet_tx_id: string;
  stock_tx_id: string;
  portfolio_id?: string;
  order_status: OrderStatus;
  is_buy: boolean;
  order_type: OrderType;
  stock_price: number;
  quantity: number;
  time_stamp: Date;
  is_deleted?: boolean;
}

export interface StockTransactionDocument extends Document {
  user_id: string;
  stock_id: string;
  wallet_tx_id: string;
  stock_tx_id: string;
  portfolio_id?: string;
  order_status: OrderStatus;
  is_buy: boolean;
  order_type: OrderType;
  stock_price: number;
  quantity: number;
  time_stamp: Date;
  is_deleted?: boolean;
}

// Order is the incoming order from order creation
// no timestamp, since I create it
export type Order = {
  wallet_tx_id: string;
  stock_tx_id: string;
  user_id: string;
  stock_id: string;
  quantity: number;
  price: number;
  order_type: string;
  is_buy: boolean;
};

export interface OrderBookOrder extends Order {
  timestamp: Date;
}

export interface MatchedOrder {
  buyOrder: OrderBookOrder;
  sellOrder: OrderBookOrder;
  quantity: number;
  matchPrice: number;
  timestamp: Date;
}

export interface StockTransactionModel
  extends Model<StockTransactionDocument> {}

export interface IOrderBook {
  buyOrders: OrderBookOrder[];
  sellOrders: OrderBookOrder[];
  matchedOrders: MatchedOrder[];
  expiredOrders: OrderBookOrder[];
  cancelledOrders: OrderBookOrder[];
  matchMarketOrder(newOrder: OrderBookOrder): [MatchedOrder[], number];
  resortOrders(): void;
  removeOrder(stockTxId: string): OrderBookOrder | null;
  matchOrder(order: Order): [MatchedOrder[], number];
  checkForExpiredOrders(): void;
  createMatchedOrder(
    order: OrderBookOrder,
    matchAgainst: Order,
    quantity: number
  ): MatchedOrder;
  findMatches(order: OrderBookOrder): [MatchedOrder[], number];
  isMatch(order: OrderBookOrder, matchAgainst: OrderBookOrder): boolean;
  removeOrderFromQueue(stockTxId: string, orderQueue: Order[]): Order | null;
  cancelOrder(stockTxId: string): Order | null;
  insertMatchedOrders(matchedOrders: MatchedOrder[]): void;
  initializeOrderBook(): Promise<void>;
  loadInProgressOrders(): Promise<void>;
  fetchOrdersByType(isBuy: boolean): Promise<Order[]>;
}
