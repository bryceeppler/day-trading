import mongoose from "mongoose";
import { StockTransactionDocument, StockTransactionModel, OrderStatus, OrderType } from '../types';

const stockTransactionSchema = new mongoose.Schema<StockTransactionDocument>({
  stock_id: { type: String, required: true },
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

export const StockTransaction: StockTransactionModel = mongoose.model<StockTransactionDocument, StockTransactionModel>('StockTransaction', stockTransactionSchema);
