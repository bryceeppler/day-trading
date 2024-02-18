import { StockTransaction } from './../models/stockTransactionModel';
import OrderBook from './orderbook';
import {
  Order,
  MatchedOrder,
  OrderType,
  IOrderBook,
} from "../types";

describe("OrderBook", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("matches simple full buy order", () => {
    orderbook.sellOrders = [
      {is_buy: false, stock_id: "1", stock_price: 10, quantity: 5, order_type: OrderType.LIMIT, time_stamp: new Date()},
    
    ];
    const order = {
      _id:2,
      is_buy: true,
      stock_id: "1",
      stock_price: 10,
      quantity: 5,
      order_type: OrderType.LIMIT,
      time_stamp: new Date(),

    };
    const [ matched, remainingQuantity ] = orderbook.matchOrder(order);
    

    expect(orderbook.matchedOrders.length).toBe(1);
    expect(matched.buyOrder).toBe(order);
    expect(matched.sellOrder).toBe(orderbook.sellOrders[0]);
    expect(remainingQuantity).toBe(0);
  });

  // it("matches partial buy order with remaining quantity", () => {
  //   orderbook.sellOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 10, quantity: 3 },
  //   ];
  //   const order = {
  //     is_buy: true,
  //     stock_id: "1",
  //     stock_price: 10,
  //     quantity: 5,
  //   };
  //   const { matched, remainingQuantity } = orderbook.matchOrder(order);

  //   expect(orderbook.matchedOrders.length).toBe(1);
  //   expect(matched.length).toBe(1);
  //   expect(remainingQuantity).toBe(2);
  // });

  // it("matches partial sell order with remaining quantity", () => {
  //   orderbook.buyOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 10, quantity: 3 },
  //   ];
  //   const order = {
  //     is_buy: false,
  //     stock_id: "1",
  //     stock_price: 10,
  //     quantity: 5,
  //   };
  //   const { matched, remainingQuantity } = orderbook.matchOrder(order);

  //   expect(orderbook.matchedOrders.length).toBe(1);
  //   expect(matched.length).toBe(1);
  //   expect(remainingQuantity).toBe(2);
  // });

  // it("matches multiple full buy orders", () => {
  //   orderbook.sellOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 10, quantity: 5 },
  //     { _id: 2, stock_id: "1", stock_price: 10, quantity: 5 },
  //   ];
  //   const order = {
  //     is_buy: true,
  //     stock_id: "1",
  //     stock_price: 10,
  //     quantity: 10,
  //   };
  //   const { matched, remainingQuantity } = orderbook.matchOrder(order);

  //   expect(orderbook.matchedOrders.length).toBe(2);
  //   expect(matched.length).toBe(2);
  //   expect(remainingQuantity).toBe(0);
  // });

  // it("matches multiple full sell orders", () => {
  //   orderbook.buyOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 12, quantity: 5 },
  //     { _id: 2, stock_id: "1", stock_price: 12, quantity: 5 },
  //   ];
  //   const order = {
  //     is_buy: false,
  //     stock_id: "1",
  //     stock_price: 12,
  //     quantity: 10,
  //   };
  //   const { matched, remainingQuantity } = orderbook.matchOrder(order);

  //   expect(orderbook.matchedOrders.length).toBe(2);
  //   expect(matched.length).toBe(2);
  //   expect(remainingQuantity).toBe(0);
  // });

  // it("matches multiple partial sell orders with remaining quantity", () => {
  //   orderbook.buyOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 15, quantity: 3 },
  //     { _id: 2, stock_id: "1", stock_price: 15, quantity: 2 },
  //   ];
  //   const order = {
  //     is_buy: false,
  //     stock_id: "1",
  //     stock_price: 15,
  //     quantity: 10,
  //   };
  //   const { matched, remainingQuantity } = orderbook.matchOrder(order);

  //   expect(orderbook.matchedOrders.length).toBe(2);
  //   expect(matched.length).toBe(2);
  //   expect(remainingQuantity).toBe(5);
  // });

  // it("matches multiple partial buy orders with remaining quantity", () => {
  //   orderbook.sellOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 8, quantity: 4 },
  //     { _id: 2, stock_id: "1", stock_price: 8, quantity: 1 },
  //   ];
  //   const order = {
  //     is_buy: true,
  //     stock_id: "1",
  //     stock_price: 8,
  //     quantity: 10,
  //   };
  //   const { matched, remainingQuantity } = orderbook.matchOrder(order);

  //   expect(orderbook.matchedOrders.length).toBe(2);
  //   expect(matched.length).toBe(2);
  //   expect(remainingQuantity).toBe(5);
  // });

  // it("matches multiple full buy and sell orders", () => {
  //   orderbook.sellOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 20, quantity: 5 },
  //     { _id: 2, stock_id: "1", stock_price: 20, quantity: 5 },
  //   ];
  //   orderbook.buyOrders = [
  //     { _id: 3, stock_id: "1", stock_price: 20, quantity: 5 },
  //     { _id: 4, stock_id: "1", stock_price: 20, quantity: 5 },
  //   ];
  //   const sellOrder = {
  //     is_buy: false,
  //     stock_id: "1",
  //     stock_price: 20,
  //     quantity: 10,
  //   };
  //   const buyOrder = {
  //     is_buy: true,
  //     stock_id: "1",
  //     stock_price: 20,
  //     quantity: 10,
  //   };
  //   const sellMatch = orderbook.matchOrder(sellOrder);
  //   const buyMatch = orderbook.matchOrder(buyOrder);

  //   expect(orderbook.matchedOrders.length).toBe(2);
  //   expect(sellMatch.matched.length + buyMatch.matched.length).toBe(2);
  //   expect(sellMatch.remainingQuantity + buyMatch.remainingQuantity).toBe(0);
  // });

  // it("matches multiple partial buy and sell orders with remaining quantities", () => {
  //   orderbook.sellOrders = [
  //     { _id: 1, stock_id: "1", stock_price: 25, quantity: 3 },
  //     { _id: 2, stock_id: "1", stock_price: 25, quantity: 2 },
  //   ];
  //   orderbook.buyOrders = [
  //     { _id: 3, stock_id: "1", stock_price: 25, quantity: 4 },
  //     { _id: 4, stock_id: "1", stock_price: 25, quantity: 1 },
  //   ];
  //   const sellOrder = {
  //     is_buy: false,
  //     stock_id: "1",
  //     stock_price: 25,
  //     quantity: 10,
  //   };
  //   const buyOrder = {
  //     is_buy: true,
  //     stock_id: "1",
  //     stock_price: 25,
  //     quantity: 10,
  //   };
  //   const sellMatch = orderbook.matchOrder(sellOrder);
  //   const buyMatch = orderbook.matchOrder(buyOrder);

  //   expect(orderbook.matchedOrders.length).toBe(4);
  //   expect(sellMatch.matched.length + buyMatch.matched.length).toBe(4);
  //   expect(sellMatch.remainingQuantity).toBe(5);
  //   expect(buyMatch.remainingQuantity).toBe(5);
  // });
});
