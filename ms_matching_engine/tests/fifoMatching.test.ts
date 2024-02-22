import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "../services/orderbook";
import { OrderType, OrderBookOrder, IOrderBook } from "../types";

describe("OrderBook FIFO Priority Tests", () => {
  let orderbook: IOrderBook;

  beforeEach(() => {
    orderbook = new OrderBook(StockTransaction);
  });

  it("executes orders based on FIFO priority when prices are equal", () => {
    // sell limit orders with the same price but different timestamps
    const timestamp_offsets = [3000, 1000, 2000];
    timestamp_offsets.forEach((time, index) => {
      orderbook.sellOrders.push({
        stock_tx_id: "1",

        user_id: "1",
        stock_id: "1",
        price: 10,
        quantity: 5,
        is_buy: false,
        order_type: OrderType.LIMIT,
        timestamp: new Date(Date.now() - time),
      });
    });

    const marketOrder: OrderBookOrder = {
      stock_tx_id: "1",
      user_id: "1",
      stock_id: "1",
      quantity: 15,
      price: 10,
      is_buy: true,
      order_type: OrderType.MARKET,
      timestamp: new Date(),
    };

    const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

    // all were matched
    expect(matched.length).toBe(3); // All sell orders matched
    expect(remainingQuantity).toBe(0); // The market order is fully filled

    // order was fifo
    expect(matched[0].sellOrder.timestamp.getTime()).toBeLessThan(
      matched[1].sellOrder.timestamp.getTime(),
    );
    expect(matched[1].sellOrder.timestamp.getTime()).toBeLessThan(
      matched[2].sellOrder.timestamp.getTime(),
    );
  });
});
