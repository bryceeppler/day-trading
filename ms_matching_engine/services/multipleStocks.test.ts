import { StockTransaction } from "../models/stockTransactionModel";
import OrderBook from "./orderbook";
import { Order, MatchedOrder, OrderBookOrder, OrderType, IOrderBook } from "../types";

describe("OrderBook Market Order Tests", () => {
    let orderbook: IOrderBook;
  
    beforeEach(() => {
      orderbook = new OrderBook(StockTransaction);
      orderbook.buyOrders = [];
      orderbook.sellOrders = [];
    });
  
    it("ensures market orders do not match with orders of a different stock_id", () => {
      orderbook.buyOrders.push({
        user_id: "2",
        stock_id: "1",
        price: 100,
        quantity: 10,
        is_buy: true,
        order_type: OrderType.LIMIT,
        timestamp: new Date(),
      });
  
      const marketOrder: OrderBookOrder = {
        user_id: "1",
        stock_id: "2",
        quantity: 10,
        is_buy: false,
        order_type: OrderType.MARKET,
        timestamp: new Date(),
        price: 5,
      };
  
      const [matched, remainingQuantity] = orderbook.matchOrder(marketOrder);

      expect(matched.length).toBe(0);
      expect(orderbook.buyOrders.length).toBe(1);
    });

  });
  