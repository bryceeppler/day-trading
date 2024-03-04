import { Document, Model } from "mongoose";
// Document and Model are mongodb types
// Document represents literally a mongo docoument
// Model represents the schema of a collection

export enum OrderType {
  LIMIT = "LIMIT",
  MARKET = "MARKET",
}

export enum MessageQueue {
  PLACE_ORDER = 'PLACE_ORDER',
  CANCEL_ORDER = 'CANCEL_ORDER',
  EXECUTE_ORDER = 'EXECUTE_ORDER'
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
  parent_stock_tx_id: {
    type: String;
    required: false;
    unqiue: false;
    default: null;
  };
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

export type Order = {
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
  executed: boolean;
}

export interface MatchedOrder {
  buyOrder: OrderBookOrder;
  sellOrder: OrderBookOrder;
  quantity: number;
  matchPrice: number;
  executed: boolean;
  timestamp: Date;
}

export interface CancelOrderRequest {
  stock_tx_id: string;
}

export interface StockTransactionModel
  extends Model<StockTransactionDocument> {}

export interface IOrderBook {
  buyOrders: OrderBookOrder[];
  sellOrders: OrderBookOrder[];
  matchedOrders: MatchedOrder[];
  expiredOrders: OrderBookOrder[];
  cancelledOrders: OrderBookOrder[];
  expiryMinutes: number;
  removeOrder(stockTxId: string): OrderBookOrder | null;
  matchOrder(order: Order): [MatchedOrder[], number];
  checkForExpiredOrders(): void;
  cancelOrder(stockTxId: string): Order | null;
  initializeOrderBook(): Promise<void>;
  flushOrders(): void;
  sendTestToExecutionService(): void;
}
