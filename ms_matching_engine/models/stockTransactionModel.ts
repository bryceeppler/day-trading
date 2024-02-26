import mongoose from "mongoose";
import { StockTransactionDocument, StockTransactionModel, OrderStatus, OrderType } from '../types';

const stockTransactionSchema = new mongoose.Schema<StockTransactionDocument>({
  user_id: { type: String, required: true },
  stock_id: { type: String, required: true },
  parent_stock_tx_id: { type: String, required: false, unqiue: false, default: null },
  wallet_tx_id: { type: String, required: true },
  portfolio_id: { type: String, required: true },
  order_status: { type: String, enum: Object.values(OrderStatus), required: true },
  is_buy: { type: Boolean, required: true },
  order_type: { type: String, enum: Object.values(OrderType), required: true },
  stock_price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  time_stamp: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, required: true, default: false },
});

export const StockTransaction: StockTransactionModel = mongoose.model<StockTransactionDocument, StockTransactionModel>('StockTransactions', stockTransactionSchema);
