import { handleApiError } from 'lib/errors';
import { useState } from 'react';
import {
  AddToUserParams,
  CreateStockParams,
  PlaceStockOrderParams,
  Stock,
  StockPortfolio,
  StockTransaction,
  WalletTransaction,
} from 'types/users.types';
import { UserApi } from 'api';

interface UseUsersInfo {
  cancelStockOrder: (stockTxId: string) => Promise<boolean>;
  placeStockOrder: (data: PlaceStockOrderParams) => Promise<string | undefined>;
  addMoney: (amount: number) => Promise<boolean>;
  fetchWalletTransactions: () => Promise<void>;
  fetchStockPortfolios: () => Promise<void>;
  fetchStockTransactions: () => Promise<void>;
  stockPortfolios: Array<StockPortfolio>;
  walletTransactions: Array<WalletTransaction>;
  stockTransactions: Array<StockTransaction>;
  fetchBalance: () => Promise<void>;
  balance?: number;
  stocks: Array<Stock>;
  fetchStocks: () => void;
  createStock: (params: CreateStockParams) => Promise<string | undefined>;
  addStockToUser: (params: AddToUserParams) => Promise<string | undefined>;
}

function useUsers(): UseUsersInfo {
  const [walletTransactions, setWalletTransactions] = useState<Array<WalletTransaction>>([]);
  const [stockTransactions, setStockTransactions] = useState<Array<StockTransaction>>([]);
  const [stockPortfolios, setStockPortfolios] = useState<Array<StockPortfolio>>([]);
  const [balance, setBalance] = useState<number>();
  const [stocks, setStocks] = useState<Array<Stock>>([]);

  const fetchBalance = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchBalance();
      setBalance(response.data.balance);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchWalletTransactions = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchWalletTransactions();
      setWalletTransactions(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchStockTransactions = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchStockTransactions();
      setStockTransactions(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchStocks = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchStocks();
      setStocks(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const createStock = async (data: CreateStockParams): Promise<string | undefined> => {
    try {
      const response = await UserApi.createStock(data);
      return response.data.error;
    } catch (error) {
      handleApiError(error);
    }
  };

  const addStockToUser = async (data: AddToUserParams): Promise<string | undefined> => {
    try {
      const response = await UserApi.addStockToUser(data);
      return response.data.error;
    } catch (error) {
      handleApiError(error);
    }
  };

  const addMoney = async (amount: number): Promise<boolean> => {
    try {
      await UserApi.addMoney(amount);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  };

  const placeStockOrder = async (data: PlaceStockOrderParams): Promise<string | undefined> => {
    try {
      const response = await UserApi.placeStockOrder(data);
      return response.data.error;
    } catch (error) {
      return handleApiError(error);
    }
  };

  const cancelStockOrder = async (stockTxId: string): Promise<boolean> => {
    try {
      await UserApi.cancelStockOrder(stockTxId);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
    }
  };

  const fetchStockPortfolios = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchStockPortfolio();
      setStockPortfolios(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  return {
    cancelStockOrder,
    addMoney,
    fetchWalletTransactions,
    fetchBalance,
    fetchStockPortfolios,
    placeStockOrder,
    fetchStocks,
    createStock,
    fetchStockTransactions,
    addStockToUser,
    stockTransactions,
    stocks,
    stockPortfolios,
    balance,
    walletTransactions,
  };
}

export default useUsers;
