import { Stat } from './utils.types';

export type UserLogin = {
  id: string;
  name: string;
  user_name: string;
};

export type StockTransaction = {
  wallet_tx_id: string;
  stock_tx_id: string;
  order_status: string;
  is_buy: boolean;
  order_type: string;
  stock_price: number;
  quantity: number;
  time_stamp: string;
};

export type WalletTransaction = {
  wallet_tx_id: string;
  stock_tx_id: string;
  is_debit: true;
  amount: number;
  time_stamp: string;
};

export type StockPortfolio = {
  stock_id: string;
  stock_name: string;
  quantity_owned: number;
};

export type Stock = {
  stock_id: string;
  stock_name: string;
  current_price: number;
};

export type PlaceStockOrderParams = {
  stock_id: string;
  is_buy: boolean;
  order_type: string;
  quantity: number;
  price: number;
};
