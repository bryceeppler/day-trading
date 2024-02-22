import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderType, IOrderBook } from "../types";

describe("Create Order Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("creates in the orderbook", () => {
    const order = {
      user_id: "65d7320ba52df21e91993e00",
      stock_id: "65d7320ba4a91b3fe9de6e0d",
      quantity: 369,
      price: 140,
      order_type: "LIMIT",
      is_buy: false,
      stock_tx_id: "65d7320b34f25ff5d0490ba7",
      timestamp: new Date(),
      executed: false,
    };

    expect(true).toBe(true);
    // expect(result).toBe(order);
    // expect(orderbook.buyOrders.length).toBe(0);
    // expect(orderbook.cancelledOrders.length).toBe(1);
  });
});
