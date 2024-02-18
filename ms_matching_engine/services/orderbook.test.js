const OrderBook = require("./orderbook");

describe("OrderBook", () => {
  beforeEach(() => {
    const orderbook = new OrderBook();
  });

  it("matches simple full order", (orderbook) => {
    orderbook.buyOrders = [
      { _id: 1, stock_id: "1", stock_price: 10, quantity: 5 },
    ];
    const order = {
      stock_id: "1",
      stock_price: 10,
      quantity: 5,
    };
    const matched = orderbook.matchOrders(order);

    expect(orderbook.matchedOrders.length).toBe(1);
    expect(matched).toBe(true);
  });

  it("matches partial buy order",  (orderbook) => {
    const order = { stock_id: "1", stock_price: 10, quantity: 5, type: "buy" };
    orderbook.sellOrders = [
      { _id: 1, stock_id: "1", stock_price: 10, quantity: 5 },
    ];
    const matched = orderbook.matchOrders(order);
    expect(orderbook.matchedOrders.length).toBe(1);
    expect(matched).toBe(true);
  });

  it("matches partial sell order",  (orderbook) => {});
  it("matches partial buy order",  (orderbook) => {});
  it("matches multiple full buy orders", () => {});
  it("matches multiple full sell orders", () => {});
  it("matches mutiple partial sell orders", () => {});
  it("matches mutiple partial buy orders", () => {});
  it("matches multiple full buy and sell orders", () => {});
  it("matches multiple partial buy and sell orders", () => {});
});
