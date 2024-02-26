import { baseMarketDataApi, baseOrderCreationApi, baseTransactionManagerApi, baseUserApi } from './config';

export const PLACE_STOCK_ORDER = `${baseOrderCreationApi}/placeStockOrder`;
export const CANCEL_STOCK_ORDER = `${baseOrderCreationApi}/cancelStockTransaction`;
export const LOGIN = `${baseUserApi}/login`;
export const REGISTER = `${baseUserApi}/register`;
export const FETCH_WALLET_TXS = `${baseTransactionManagerApi}/getWalletTransactions`;
export const FETCH_STOCK_TXS = `${baseTransactionManagerApi}/getStockTransactions`;
export const FETCH_STOCK_PORTFOLIO = `${baseUserApi}/getStockPortfolio`;
export const FETCH_BALANCE = `${baseUserApi}/getWalletBalance`;
export const FETCH_STOCKS = `${baseMarketDataApi}/getallstocks`;
export const ADD_MONEY = `${baseUserApi}/addMoneyToWallet`;
