import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderBookOrder, OrderType, IOrderBook } from "../types";

describe("Expired Orders on Receiving Order", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  function addExpiredOrder(orderbook: IOrderBook, isBuyOrder: boolean, orderType: OrderType) {
    const expiredOrder = {
      user_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 10,
      price: 100,
      is_buy: isBuyOrder,
      order_type: orderType,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
    };
    if (isBuyOrder) {
      orderbook.buyOrders.push(expiredOrder);
    } else {
      orderbook.sellOrders.push(expiredOrder);
    }
  }

  it("removes expired limit buy order when a new sell order arrives", () => {
    addExpiredOrder(orderbook, true, OrderType.LIMIT);

    const newOrder: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 10,
      price: 100,
      is_buy: false,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
    };

    orderbook.matchOrder(newOrder);

    expect(orderbook.buyOrders.length).toBe(0);
    expect(orderbook.expiredOrders.length).toBe(1);
  });

  it("removes expired sell order when a new buy order arrives", () => {
    addExpiredOrder(orderbook, false, OrderType.LIMIT);

    const newOrder: OrderBookOrder = {
      user_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 10,
      price: 100,
      is_buy: true,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
    };

    orderbook.matchOrder(newOrder);

    expect(orderbook.sellOrders.length).toBe(0);
    expect(orderbook.expiredOrders.length).toBe(1);
  });

});
