import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderType, IOrderBook } from "../types";

describe("Cancel Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("cancels an order that exists in the orderbook", () => {
    const order = {
      user_id: "1",
      wallet_tx_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 5,
      price: 10,
      is_buy: true,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
    };
    orderbook.buyOrders.push(order);

    const result = orderbook.cancelOrder("1");

    expect(result).toBe(order);
    expect(orderbook.buyOrders.length).toBe(0);
    expect(orderbook.cancelledOrders.length).toBe(1);
  });

  it("should return null if the order cannot be found", () => {
    const orderInBook = {
      user_id: "1",
      stock_tx_id: "1",
      stock_id: "1",
      quantity: 5,
      price: 10,
      is_buy: true,
      order_type: OrderType.LIMIT,
      timestamp: new Date(),
    };

    orderbook.buyOrders.push(orderInBook);

    const result = orderbook.cancelOrder("2");

    expect(result).toBe(null);
    expect(orderbook.buyOrders.length).toBe(1);
    expect(orderbook.cancelledOrders.length).toBe(0);
  });

  it("should return null if the queues are empty", () => {
    const result = orderbook.cancelOrder("1");

    expect(result).toBe(null);
  });
});
