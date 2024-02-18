import { Document, Model } from 'mongoose';
// Document and Model are mongodb types

export enum OrderType {
  LIMIT = "LIMIT",
  MARKET = "MARKET",
}

export enum OrderStatus {
  IN_PROGRESS = "IN_PROGRESS",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
}

export interface IStockTransaction extends Document {
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

export interface Order {
  _id?: number;
  stock_id: string;
  stock_price: number;
  quantity: number;
  is_buy: boolean;
  type: OrderType;
}

export interface MatchedOrder {
  buyOrder: Order;
  sellOrder: Order;
  quantity: number;
  matchPrice: number;
  timestamp: Date;
}


export interface IStockTransactionModel extends Model<IStockTransaction> {}
