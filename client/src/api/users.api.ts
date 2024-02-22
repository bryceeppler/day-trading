import { BaseApi } from 'api';
import {
  ADD_MONEY,
  CANCEL_STOCK_ORDER,
  FETCH_BALANCE,
  FETCH_STOCKS,
  FETCH_STOCK_PORTFOLIO,
  FETCH_STOCK_TXS,
  FETCH_WALLET_TXS,
  PLACE_STOCK_ORDER,
} from 'lib/routes';
import { PlaceStockOrderParams } from 'types/users.types';
import { SuccessApiResponse } from 'types/utils.types';

export const fetchBalance = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${FETCH_BALANCE}`);
};

export const fetchWalletTransactions = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${FETCH_WALLET_TXS}`);
};

export const fetchStockTransactions = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${FETCH_STOCK_TXS}`);
};

export const fetchStockPortfolio = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${FETCH_STOCK_PORTFOLIO}`);
};

export const fetchStocks = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${FETCH_STOCKS}`);
};

export const addMoney = async (amount: number): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${ADD_MONEY}`, { amount });
};

export const placeStockOrder = async (data: PlaceStockOrderParams): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${PLACE_STOCK_ORDER}`, data);
};

export const cancelStockOrder = async (stock_tx_id: string): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${CANCEL_STOCK_ORDER}`, { stock_tx_id });
};
