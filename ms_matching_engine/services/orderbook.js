// const axios = require('axios');
module.exports = class OrderBook {
  constructor(stockTransactionModel) {
    this.stockTransactionModel = stockTransactionModel;
    this.buyOrders = [];
    this.sellOrders = [];
    this.matchedOrders = [];
    this.cancelledOrders = [];
    this.expiredOrders = [];
    // this.init();
  }
  matchMarketOrder(newOrder) {
    const orderQueue = newOrder.is_buy ? this.sellOrders : this.buyOrders;
    let remainingQty = newOrder.quantity;

    for (let i = 0; i < orderQueue.length && remainingQty > 0; i++) {
      const matchAgainst = orderQueue[i];
      if (this.isMatch(newOrder, matchAgainst) === false) continue;
      const matchedQuantity = Math.min(remainingQty, matchAgainst.quantity);
      remainingQty -= matchedQuantity;
      matchAgainst.quantity -= matchedQuantity;

      this.matchedOrders.push(this.createMatchedOrder(newOrder, matchAgainst, matchedQuantity));

      if (matchAgainst.quantity === 0) {
        orderQueue.splice(i, 1);
        i--; 
      }
    }

    if (remainingQty > 0) {
      // What do we do with a partially filled market order?
    }

    return this.matchedOrders;
  }

  resort() {
    this.buyOrders.sort((a, b) => a.stock_price - b.stock_price);
    this.sellOrders.sort((a, b) => a.stock_price - b.stock_price);
  }

  async init() {
    await this.loadOrders();
    console.log(
      "Orderbook initialized with ",
      this.buyOrders.length,
      " buy orders and ",
      this.sellOrders.length,
      " sell orders..."
    );
  }

  async loadOrders() {
    let allBuyOrders = await this.stockTransactionModel
      .find({ order_type: "LIMIT", is_buy: true, order_status: "IN_PROGRESS" })
      .sort({ stock_price: -1, time_stamp: 1 });
    let allSellOrders = await this.stockTransactionModel
      .find({ order_type: "LIMIT", is_buy: false, order_status: "IN_PROGRESS" })
      .sort({ stock_price: 1, time_stamp: 1 });

    this.buyOrders = allBuyOrders;
    this.sellOrders = allSellOrders;
  }

  checkForExpiredOrders() {
    console.log("checking for expired orders");
    return
  }

  createMatchedOrder(order, matchAgainst, quantity) {
    return {
      buyOrder: order.is_buy ? order : matchAgainst,
      sellOrder: order.is_buy ? matchAgainst : order,
      quantity,
      matchPrice: matchAgainst.stock_price,
      timestamp: new Date(),
    };
  }

  findMatches(order) {
    const matched = [];
    let remainingQty = order.quantity;
    const orderQueue = order.is_buy ? this.orders.sell : this.orders.buy;

    orderQueue.forEach((matchAgainst, i) => {
      if (remainingQty <= 0 || !this.isMatch(order, matchAgainst)) return;

      const matchedQuantity = Math.min(remainingQty, matchAgainst.quantity);
      remainingQty -= matchedQuantity;
      matchAgainst.quantity -= matchedQuantity;

      matched.push(this.createMatchedOrder(order, matchAgainst, matchedQuantity));
      if (matchAgainst.quantity === 0) orderQueue.splice(i, 1); // Remove fully matched orders
    });

    return { matched, remainingQty };
  }
  isMatch(order, matchAgainst) {
    return order.is_buy ? matchAgainst.stock_price <= order.stock_price : matchAgainst.stock_price >= order.stock_price;
  }

  handlePartialOrder(order, remainingQty) {
    if (remainingQty > 0 && order.quantity !== remainingQty) {
      this.insertOrder({ ...order, quantity: remainingQty });
    }
  }


  matchOrder(newOrder) {
    this.resortOrders();
    if (newOrder.type === "MARKET") {
      return this.matchMarketOrder(newOrder);
    } else {
      const { matched } = this.findMatches(newOrder);
      this.handlePartialOrder(newOrder, remainingQty);
      return matched;
    }
  }

  flushOrders() {
    // send matched, cancelled, expired orders to order execution service
    console.log("Flushing orders");
    console.log("Matched orders:", this.matchedOrders.length);
    this.sendOrdersToOrderExecutionService(
      this.matchedOrders,
      this.cancelledOrders,
      this.expiredOrders
    );
  }

  insertOrder(order) {
    if (order.order_type === "LIMIT") {
      if (order.is_buy) {
        this.buyOrders.push(order);
      } else {
        this.sellOrders.push(order);
      }
      this.resort();
    } else {
      this.matchMarketOrder(order);
    }
  }

  async sendOrdersToOrderExecutionService(
    matchedOrders,
    cancelledOrders,
    expiredOrders
  ) {
    console.log("Sending orders to order execution service");

    // empty the arrays
    matchedOrders = [];
    cancelledOrders = [];
    expiredOrders = [];

    // const executionServiceUrl = "http://ms_order_execution:8002/";

    // try {
    //     // send http request to order execution service containing the orders
    //     const response = await axios.post(executionServiceUrl, {
    //         matchedOrders,
    //         cancelledOrders,
    //         expiredOrders
    //     });

    //     console.log("Order execution service response:", response.data);

    // } catch (error) {
    //     console.error("Error sending orders to order execution service:", error);
    // }
  }
};
