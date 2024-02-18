import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "./orderbook";
import { Order, MatchedOrder, OrderType, IOrderBook } from "../types";

describe("OrderBook Market Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("execute a sell market order at the best available buy price", () => {
    const olderTimeStamp = new Date(new Date().getTime() - 1000); // -1000 milliseconds
    const newerTimeStamp = new Date();
    orderbook.buyOrders = [
      {
        stock_id: "1",
        stock_price: 19,
        quantity: 10,
        is_buy: true,
        order_type: OrderType.LIMIT,
        time_stamp: olderTimeStamp,
      },
      {
        stock_id: "1",
        stock_price: 20,
        quantity: 10,
        is_buy: true,
        order_type: OrderType.LIMIT,
        time_stamp: newerTimeStamp,
      },
    ];
    const marketOrder: Order = {
      stock_id: "1",
      stock_price: 19,
      quantity: 5,
      is_buy: false,
      order_type: OrderType.MARKET,
      time_stamp: new Date(),
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(1); // should match with the (best price) buy order at 20
    expect(matched[0].quantity).toBe(5);
    expect(remainingQuantity).toBe(0);
    expect(orderbook.buyOrders[0].quantity).toBe(5);
    expect(matched[0].matchPrice).toBe(20);
  });

  it("does not execute a market order when there are no matching orders", () => {
    const marketOrder: Order = {
      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      time_stamp: new Date(),
      stock_price: 10,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(0);
    expect(remainingQuantity).toBe(5);
  });

  it("partially fills a market order", () => {
    orderbook.sellOrders = [
      {
        stock_id: "1",
        stock_price: 10,
        quantity: 3,
        is_buy: false,
        order_type: OrderType.LIMIT,
        time_stamp: new Date(),
      },
    ];
    const marketOrder: Order = {
      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      stock_price: 10,
      time_stamp: new Date(),
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(1);
    expect(matched[0].quantity).toBe(3);
    expect(remainingQuantity).toBe(2);
  });

  it("fully fills a market order across multiple limit orders", () => {
    orderbook.sellOrders = [
      {
        stock_id: "1",
        stock_price: 10,
        quantity: 3,
        is_buy: false,
        order_type: OrderType.LIMIT,
        time_stamp: new Date(),
      },
      {
        stock_id: "1",
        stock_price: 11,
        quantity: 2,
        is_buy: false,
        order_type: OrderType.LIMIT,
        time_stamp: new Date(),
      },
    ];
    const marketOrder: Order = {
      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      time_stamp: new Date(),
      stock_price: 11,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(0);
  });
});
