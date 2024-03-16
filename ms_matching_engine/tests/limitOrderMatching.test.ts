import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderType, IOrderBook, OrderBookOrder } from "../types";

describe("OrderBook Limit Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("matches simple full buy order", () => {
    orderbook.sellOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        is_buy: false,
        stock_id: "1",
        price: 10,
        quantity: 5,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order: OrderBookOrder = {
      user_id: "2",
      stock_tx_id: "1",

      is_buy: true,
      stock_id: "1",
      price: 10,
      quantity: 5,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(1);
    expect(matched.length).toBe(1);
    expect(matched[0].quantity).toBe(5);
    expect(matched[0].buyOrder).toBe(order);
    // fulfilled order should be removed from sellOrders
    expect(orderbook.sellOrders.length).toBe(0);
    expect(remainingQuantity).toBe(0);
  });

  it("matches partial buy order with remaining quantity", () => {
    orderbook.sellOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        is_buy: false,
        stock_id: "1",
        price: 10,
        quantity: 3,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order = {
      user_id: "2",
      stock_tx_id: "1",

      is_buy: true,
      stock_id: "1",
      price: 10,
      quantity: 5,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(1);
    expect(matched.length).toBe(1);
    expect(remainingQuantity).toBe(2);
  });

  it("matches partial sell order with remaining quantity", () => {
    orderbook.buyOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 10,
        quantity: 3,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order = {
      user_id: "2",
      stock_tx_id: "1",

      is_buy: false,
      stock_id: "1",
      price: 10,
      quantity: 5,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(1);
    expect(matched.length).toBe(1);
    expect(remainingQuantity).toBe(2);
  });

  it("matches multiple full buy orders", () => {
    orderbook.sellOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 10,
        quantity: 5,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        user_id: "2",
        stock_tx_id: "1",

        stock_id: "1",
        price: 10,
        quantity: 5,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order = {
      user_id: "3",
      stock_tx_id: "1",

      is_buy: true,
      stock_id: "1",
      price: 10,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(2);
    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(0);
  });

  it("matches multiple full sell orders", () => {
    orderbook.buyOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 12,
        quantity: 5,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        user_id: "2",
        stock_tx_id: "1",

        stock_id: "1",
        price: 12,
        quantity: 5,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order = {
      user_id: "3",
      stock_tx_id: "1",

      is_buy: false,
      stock_id: "1",
      price: 12,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(2);
    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(0);
  });

  it("matches multiple partial sell orders with remaining quantity", () => {
    orderbook.buyOrders = [
      {
        stock_id: "1",
        user_id: "1",
        stock_tx_id: "1",

        price: 15,
        quantity: 3,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        stock_id: "1",
        user_id: "2",
        stock_tx_id: "1",

        price: 15,
        quantity: 2,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order = {
      user_id: "3",
      stock_tx_id: "1",

      is_buy: false,
      stock_id: "1",
      price: 15,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(2);
    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(5);
  });

  it("matches multiple partial buy orders with remaining quantity", () => {
    orderbook.sellOrders = [
      {
        stock_id: "1",
        user_id: "1",
        stock_tx_id: "1",

        price: 8,
        quantity: 4,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        stock_id: "1",
        user_id: "2",
        stock_tx_id: "1",

        price: 8,
        quantity: 1,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const order = {
      user_id: "3",
      stock_tx_id: "1",

      is_buy: true,
      stock_id: "1",
      price: 8,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [matched, remainingQuantity] = orderbook.matchOrder(order);

    expect(orderbook.matchedOrders.length).toBe(2);
    expect(matched.length).toBe(2);
    expect(remainingQuantity).toBe(5);
  });

  it("matches multiple full buy and sell orders", () => {
    orderbook.sellOrders = [
      {
        stock_id: "1",
        user_id: "1",
        stock_tx_id: "1",

        price: 20,
        quantity: 5,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        stock_id: "1",
        user_id: "2",
        stock_tx_id: "1",

        price: 20,
        quantity: 5,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    orderbook.buyOrders = [
      {
        stock_id: "1",
        user_id: "3",
        stock_tx_id: "1",

        price: 20,
        quantity: 5,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        stock_id: "1",
        user_id: "5",
        stock_tx_id: "1",

        price: 20,
        quantity: 5,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ];
    const sellOrder = {
      user_id: "4",
      stock_tx_id: "1",

      is_buy: false,
      stock_id: "1",
      price: 20,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const buyOrder = {
      user_id: "6",
      stock_tx_id: "1",

      is_buy: true,
      stock_id: "1",
      price: 20,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [sellMatch, remainingSellQuantity] = orderbook.matchOrder(sellOrder);
    const [buyMatch, remainingBuyQuantity] = orderbook.matchOrder(buyOrder);

    expect(orderbook.matchedOrders.length).toBe(4);
    expect(sellMatch.length + buyMatch.length).toBe(4);
    expect(remainingSellQuantity + remainingBuyQuantity).toBe(0);
  });

  it("matches multiple partial buy and sell orders with remaining quantities", () => {
    orderbook.sellOrders = [
      {
        user_id: "1",
        stock_tx_id: "1",

        stock_id: "1",
        price: 25,
        quantity: 3,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        user_id: "2",
        stock_tx_id: "1",

        stock_id: "1",
        price: 25,
        quantity: 2,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ] as OrderBookOrder[];

    orderbook.buyOrders = [
      {
        user_id: "3",
        stock_tx_id: "1",

        stock_id: "1",
        price: 25,
        quantity: 4,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
      {
        user_id: "4",
        stock_tx_id: "1",

        stock_id: "1",
        price: 25,
        quantity: 1,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
        executed: false,
      },
    ] as OrderBookOrder[];

    const sellOrder: OrderBookOrder = {
      user_id: "5",
      stock_tx_id: "1",

      is_buy: false,
      stock_id: "1",
      price: 25,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };

    const buyOrder: OrderBookOrder = {
      user_id: "6",
      stock_tx_id: "1",

      is_buy: true,
      stock_id: "1",
      price: 25,
      quantity: 10,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
      executed: false,
    };
    const [sellMatch, remainingSellQuantity] = orderbook.matchOrder(sellOrder);
    const [buyMatch, remainingBuyQuantity] = orderbook.matchOrder(buyOrder);

    expect(orderbook.matchedOrders.length).toBe(5);
    expect(sellMatch.length + buyMatch.length).toBe(5); // Assuming [0] is the array of matched orders
    expect(remainingSellQuantity).toBe(5);
    expect(remainingBuyQuantity).toBe(0);
  });
});
