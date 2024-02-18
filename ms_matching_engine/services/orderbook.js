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

  /**
   * Match a market order against the orderbook and return the matched orders
   */
  matchMarketOrder(newOrder) {
    const orderQueue = newOrder.is_buy ? this.sellOrders : this.buyOrders;
    let remainingQty = newOrder.quantity;

    for (let i = 0; i < orderQueue.length && remainingQty > 0; i++) {
      const matchAgainst = orderQueue[i];
      if (this.isMatch(newOrder, matchAgainst) === false) continue;
      const matchedQuantity = Math.min(remainingQty, matchAgainst.quantity);
      remainingQty -= matchedQuantity;
      matchAgainst.quantity -= matchedQuantity;

      this.matchedOrders.push(
        this.createMatchedOrder(newOrder, matchAgainst, matchedQuantity)
      );

      if (matchAgainst.quantity === 0) {
        orderQueue.splice(i, 1); // remove fully matched order from the orderbook
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

  async initializeOrderBook() {
    await this.loadInProgressOrders();
    console.log(
      "Orderbook initialized with ",
      this.buyOrders.length,
      " buy orders and ",
      this.sellOrders.length,
      " sell orders..."
    );
  }

  /**
   * Only run on init, loads all in progress orders from the database.
   */
  async loadInProgressOrders() {
    this.buyOrders = await this.fetchOrdersByType(true); // isBuy = true
    this.sellOrders = await this.fetchOrdersByType(false); // isBuy = false
  }

  async fetchOrdersByType(isBuy) {
    return await this.stockTransactionModel.find({
      order_type: "LIMIT",
      is_buy: isBuy,
      order_status: "IN_PROGRESS"
    }).sort({ stock_price: isBuy ? -1 : 1, time_stamp: 1 });
  }

  /**
   * Check for expired orders and add them to the expiredOrders array
   */
  checkForExpiredOrders() {
    console.log("checking for expired orders");
    return;
  }

  /**
   * Given a pair of matched orders, create a new matched order object
   */
  createMatchedOrder(order, matchAgainst, quantity) {
    return {
      buyOrder: order.is_buy ? order : matchAgainst,
      sellOrder: order.is_buy ? matchAgainst : order,
      quantity,
      matchPrice: matchAgainst.stock_price,
      timestamp: new Date(),
    };
  }

  /**
   * Find all matches for a given order and return the matched orders and the remaining quantity
   */
  findMatches(order) {
    const matched = [];
    const remainingQty = order.quantity;
    const orderQueue = order.is_buy ? this.orders.sell : this.orders.buy;

    orderQueue.forEach((matchAgainst, i) => {
      if (remainingQty <= 0 || !this.isMatch(order, matchAgainst)) return;

      const matchedQuantity = Math.min(remainingQty, matchAgainst.quantity);
      remainingQty -= matchedQuantity;
      matchAgainst.quantity -= matchedQuantity;

      matched.push(
        this.createMatchedOrder(order, matchAgainst, matchedQuantity)
      );
      if (matchAgainst.quantity === 0) orderQueue.splice(i, 1); // Remove fully matched orders
    });

    return matched;
  }
  isMatch(order, matchAgainst) {
    return order.is_buy
      ? matchAgainst.stock_price <= order.stock_price
      : matchAgainst.stock_price >= order.stock_price;
  }

  /**
   * Handle remaining quantity of a partially filled order by pushing it into the orderbook
   */
  handlePartialOrder(order, remainingQty) {
    if (remainingQty > 0 && order.quantity !== remainingQty) {
      this.insertOrder({ ...order, quantity: remainingQty });
    }
  }

  /**
   * Given a matched order, remove it from the appropriate orderbook if
   * it is found
   */
  removeOrder(order) {
    pass;
  }

  /**
   * Entry point for matching, calls the proper function based on limit or market order
   */
  matchOrder(newOrder) {
    this.resortOrders();
    if (newOrder.type === "MARKET") {
      return this.matchMarketOrder(newOrder);
    } else {
      return this.matchLimitOrder(newOrder);
    }
  }

  matchLimitOrder(newOrder) {
    const matchedOrders = this.findMatches(newOrder);
    this.handlePartialOrder(newOrder, remainingQty);
    return matchedOrders;
  }

  /**
   * Send matched, cancelled, expired orders to order execution service
   */
  flushOrders() {
    console.log("Flushing orders");
    console.log("Matched orders:", this.matchedOrders.length);
    this.sendOrdersToOrderExecutionService(
      this.matchedOrders,
      this.cancelledOrders,
      this.expiredOrders
    );
  }

  /**
   * Insert a new order into the orderbook and resort
   */
  insertOrder(order) {
    // if (order.order_type === "LIMIT") {
    if (order.is_buy) {
      this.buyOrders.push(order);
    } else {
      this.sellOrders.push(order);
    }
    this.resort();
    // } else {
    //   this.matchMarketOrder(order);
    // }
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
