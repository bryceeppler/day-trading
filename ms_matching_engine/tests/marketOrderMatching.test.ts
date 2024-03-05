import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderBookOrder, OrderType, IOrderBook } from "../types";

describe("OrderBook Market Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  // Preconditions:

  // User 1 has 500 quantity of Stock A

  // User 2 has sufficient funds in their account.

  // Steps to Reproduce:

  it("executes with correct price", () => {
    // This tests a scenario described by Freya where the incorrect order is matched.
    // We have no knowledge wallet transactions or anything, we just check the correct
    // message is sent to the execution service.

    // User 1 sell limit order Stock A quantity 10 at price 150
    const order1: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 10,
      is_buy: false,
      order_type: OrderType.LIMIT,
      timestamp: new Date(new Date().getTime() - 5000),
      executed: false,
      price: 150,
    };

    orderbook.matchOrder(order1);

    // User 1 sell limit order Stock A quantity 10 at price 125
    const order2: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 10,
      is_buy: false,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
      price: 125,
    };

    orderbook.matchOrder(order2);

    // User 2 buy market order Stock A quantity 5
    const order3: OrderBookOrder = {
      user_id: "2",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
      executed: false,
      price: 150,
    };

    // User 2 Stock transaction shows buy order complete at price 150 and wallet transaction of 750
    // it should buy at the best available price
    const [matched, remainingQuantity] = orderbook.matchOrder(order3);
    console.log(matched);
    expect(matched.length).toBe(1);
    expect(matched[0].quantity).toBe(5);
    expect(remainingQuantity).toBe(0);
    expect(orderbook.buyOrders.length).toBe(0);
    expect(orderbook.sellOrders.length).toBe(2);
    expect(matched[0].matchPrice).toBe(125);
  });

  it("execute a sell market order at the best available buy price", () => {
    const olderTimeStamp = new Date(new Date().getTime() - 1000);
    const newerTimeStamp = new Date();
    orderbook.buyOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 19,
        quantity: 10,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: olderTimeStamp,
        executed: false,
      },
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 20,
        quantity: 10,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: newerTimeStamp,
        executed: false,
      },
    ];
    const marketOrder: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",

      stock_id: "1",
      price: 19,
      quantity: 5,
      is_buy: false,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(1); // should match with the (best price) buy order at 20
    expect(matched[0].quantity).toBe(5);
    expect(remainingQuantity).toBe(0);
    expect(orderbook.buyOrders[0].quantity).toBe(5);
    expect(matched[0].matchPrice).toBe(20);
  });

  it("does not execute a market order when there are no matching orders", () => {
    const marketOrder: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",

      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
      executed: false,
      price: 10,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(0);
    expect(remainingQuantity).toBe(5);
  });

  it("partially fills a market order", () => {
    orderbook.sellOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 10,
        quantity: 3,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const marketOrder: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",

      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      price: 10,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(1);
    expect(matched[0].quantity).toBe(3);
    expect(remainingQuantity).toBe(2);
  });

  it("fully fills a market order across multiple limit orders", () => {
    orderbook.sellOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 10,
        quantity: 3,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 11,
        quantity: 2,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const marketOrder: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",

      stock_id: "1",
      quantity: 5,
      is_buy: true,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
      executed: false,
      price: 11,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(0);
  });
});
