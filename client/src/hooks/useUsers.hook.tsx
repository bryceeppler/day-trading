import { handleApiError } from 'lib/errors';
import React, { useState } from 'react';
import { PlaceStockOrderParams, Stock, StockPortfolio, StockTransaction, WalletTransaction } from 'types/users.types';
import { UserApi } from 'api';

interface UseUsersInfo {
  cancelStockOrder: (stockTxId: string) => Promise<boolean>;
  placeStockOrder: (data: PlaceStockOrderParams) => Promise<boolean>;
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
      console.log(response);
      setBalance(response.data.balance);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchWalletTransactions = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchWalletTransactions();
      console.log(response);
      setWalletTransactions(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchStockTransactions = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchStockTransactions();
      console.log(response);
      setStockTransactions(response.data);
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchStocks = async (): Promise<void> => {
    try {
      const response = await UserApi.fetchStocks();
      console.log(response);
      setStocks(response.data);
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

  const placeStockOrder = async (data: PlaceStockOrderParams): Promise<boolean> => {
    try {
      await UserApi.placeStockOrder(data);
      return true;
    } catch (error) {
      handleApiError(error);
      return false;
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
      const response = await UserApi.fetchBalance();
      console.log(response);
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
    fetchStockTransactions,
    stockTransactions,
    stocks,
    stockPortfolios,
    balance,
    walletTransactions,
  };
}

export default useUsers;
