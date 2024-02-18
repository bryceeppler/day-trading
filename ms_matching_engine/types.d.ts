import { Document, Model } from 'mongoose';
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

export interface StockTransactionDocument extends Document {
  stock_id: string;
  wallet_tx_id: string;
  portfolio_id: string;
  order_status: ORDER_STATUS;
  is_buy: boolean;
  order_type: ORDER_TYPE;
  stock_price: number;
  quantity: number;
  time_stamp: Date;
  is_deleted: boolean;
}

// Order is IStockTransaction
export interface Order extends StockTransactionDocument {
}

export interface MatchedOrder {
  buyOrder: Order;
  sellOrder: Order;
  quantity: number;
  matchPrice: number;
  timestamp: Date;
}


export interface StockTransactionModel extends Model<StockTransactionDocument> {}


export interface IOrderBook {
  buyOrders: Order[];
  sellOrders: Order[];
  matchedOrders: MatchedOrder[];
  expiredOrders: Order[];

  removeOrder(order: Order): void;
  matchOrder(order: Order): MatchedOrder[];
  checkForExpiredOrders(): void;
  createMatchedOrder(order: Order, matchAgainst: Order, quantity: number): MatchedOrder;
  findMatches(order: Order): [MatchedOrder[], number];
  isMatch(order: Order, matchAgainst: Order): boolean;
}