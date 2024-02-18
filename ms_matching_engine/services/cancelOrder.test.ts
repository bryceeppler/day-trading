import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "./orderbook";
import { Order, MatchedOrder, OrderType, IOrderBook } from "../types";

describe("Cancel Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("cancels an order that exists in the orderbook", () => {
    const order = {
      stock_id: "1",
      quantity: 5,
      stock_price: 10,
      is_buy: true,
      order_type: OrderType.LIMIT,
      time_stamp: new Date(),
    };
    orderbook.buyOrders.push(order);

    const result = orderbook.cancelOrder(order);

    expect(result).toBe(order);
    expect(orderbook.buyOrders.length).toBe(0);
    expect(orderbook.cancelledOrders.length).toBe(1);
  });

  it("should return null if the order cannot be found", () => {
    const orderInBook = {
      stock_id: "1",
      quantity: 5,
      stock_price: 10,
      is_buy: true,
      order_type: OrderType.LIMIT,
      time_stamp: new Date(),
    };

    const orderToCancel = {
      stock_id: "2",
      quantity: 5,
      stock_price: 10,
      is_buy: true,
      order_type: OrderType.LIMIT,
      time_stamp: new Date(),
    };
    orderbook.buyOrders.push(orderInBook);

    const result = orderbook.cancelOrder(orderToCancel);

    expect(result).toBe(null);
    expect(orderbook.buyOrders.length).toBe(1);
    expect(orderbook.cancelledOrders.length).toBe(0);
  });
});
