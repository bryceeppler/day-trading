import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderBookOrder, OrderType, IOrderBook } from "../types";

describe("OrderBook Market Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
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
      price: 11,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(0);
  });
});
