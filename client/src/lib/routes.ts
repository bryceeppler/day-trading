import { baseAPIUrl } from './config';

export const PLACE_STOCK_ORDER = `${baseAPIUrl}/placeStockOrder`;
export const CANCEL_STOCK_ORDER = `${baseAPIUrl}/cancelStockTransaction`;
export const LOGIN = `${baseAPIUrl}/login`;
export const REGISTER = `${baseAPIUrl}/register`;
export const FETCH_WALLET_TXS = `${baseAPIUrl}/getWalletTransactions`;
export const FETCH_STOCK_TXS = `${baseAPIUrl}/getStockTransactions`;
export const FETCH_STOCK_PORTFOLIO = `${baseAPIUrl}/getStockPortfolio`;
export const FETCH_BALANCE = `${baseAPIUrl}/getWalletBalance`;
export const FETCH_STOCKS = `${baseAPIUrl}/getallstocks`;
export const CREATE_STOCK = `${baseAPIUrl}/createStock`;
export const ADD_STOCK_TO_USER = `${baseAPIUrl}/addStockToUser`;
export const ADD_MONEY = `${baseAPIUrl}/addMoneyToWallet`;
