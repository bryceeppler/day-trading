import { Order, MatchedOrder, IOrderBook, OrderBookOrder } from "../types";

import { StockTransaction } from "../models/stockTransactionModel";

const axios = require("axios");

export default class OrderBook implements IOrderBook {
  stockTransactionModel: typeof StockTransaction;
  buyOrders: OrderBookOrder[] = [];
  sellOrders: OrderBookOrder[] = [];
  matchedOrders: MatchedOrder[] = [];
  cancelledOrders: OrderBookOrder[] = [];
  expiredOrders: OrderBookOrder[] = [];

  constructor(stockTransactionModel: typeof StockTransaction) {
    this.stockTransactionModel = stockTransactionModel;
    this.buyOrders = [];
    this.sellOrders = [];
    this.matchedOrders = [];
    this.cancelledOrders = [];
    this.expiredOrders = [];
  }

  public async initializeOrderBook() {
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
   * Entry point for matching, calls the proper function based on limit or market order
   */
  public matchOrder(newOrder: OrderBookOrder): [MatchedOrder[], number] {
    this.resortOrders();
    if (newOrder.order_type === "MARKET") {
      return this.matchMarketOrder(newOrder);
    } else {
      return this.matchLimitOrder(newOrder);
    }
  }

  /**
   * Given a order, remove it from the orderbook and return it
   */
  public removeOrder(stock_tx_id: string): OrderBookOrder | null {
    let order = this.removeOrderFromQueue(stock_tx_id, this.buyOrders);
    if (order) return order;
    order = this.removeOrderFromQueue(stock_tx_id, this.sellOrders);
    return order;
  }

  /**
   * Check for expired buy and sell orders.
   */
  public checkForExpiredOrders(): void {
    this.checkQueueForExpiredOrders(this.buyOrders);
    this.checkQueueForExpiredOrders(this.sellOrders);
  }

  public cancelOrder(stockTxId: string): Order | null {
    const cancelledOrder = this.removeOrder(stockTxId);
    cancelledOrder && this.cancelledOrders.push(cancelledOrder);
    return cancelledOrder as Order;
  }

  /**
   * Send matched, cancelled, expired orders to order execution service
   */
  public flushOrders() {
    console.log("Flushing orders");
    this.sendOrdersToOrderExecutionService(
      this.matchedOrders,
      this.cancelledOrders,
      this.expiredOrders
    );
  }

  /**
   * Check if an timestamp has expired
   */
  private isExpired(timestamp: Date) {
    const now = new Date();
    return now.getTime() - timestamp.getTime() > 60 * 15 * 1000;
  }

  /**
   * Match a market order against the orderbook and return the matched orders
   */
  private matchMarketOrder(newOrder: OrderBookOrder): [MatchedOrder[], number] {
    const orderQueue = newOrder.is_buy ? this.sellOrders : this.buyOrders;
    let remainingQty = newOrder.quantity;

    for (let i = 0; i < orderQueue.length && remainingQty > 0; i++) {
      const matchAgainst = orderQueue[i];
      if (this.isExpired(matchAgainst.timestamp)) {
        this.expiredOrders.push(orderQueue.splice(i, 1)[0]);
        i--;
        continue;
      }
      if (this.isMatch(newOrder, matchAgainst) === false) continue;
      const matchedQuantity = Math.min(remainingQty, matchAgainst.quantity);
      remainingQty -= matchedQuantity;
      matchAgainst.quantity -= matchedQuantity;

      this.insertMatchedOrders([
        this.createMatchedOrder(newOrder, matchAgainst, matchedQuantity),
      ]);

      if (matchAgainst.quantity === 0) {
        orderQueue.splice(i, 1); // remove fully matched order from the orderbook
        i--;
      }
    }

    if (remainingQty > 0) {
      // TODO: What do we do with a partially filled market order?
    }

    return [this.matchedOrders, remainingQty];
  }

  /**
   * Insert MatchedOrder objects into the matchedOrders array
   */
  private insertMatchedOrders(matchedOrders: MatchedOrder[]) {
    this.matchedOrders.push(...matchedOrders);
  }

  /**
   * Resort the buy and sell orders
   */
  private resortOrders() {
    this.buyOrders.sort((a, b) => {
      if (b.price === a.price) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
      return b.price - a.price;
    });

    this.sellOrders.sort((a, b) => {
      if (a.price === b.price) {
        return a.timestamp.getTime() - b.timestamp.getTime();
      }
      return a.price - b.price;
    });
  }

  /**
   * Only run on init, loads all in progress orders from the database.
   * There is no timestamp field in the database, so we assign one
   * to be 15 mins from now.
   */
  private async loadInProgressOrders() {
    const buyOrderDocuments = await this.fetchOrdersByType(true); // isBuy = true
    const sellOrderDocuments = await this.fetchOrdersByType(false); // isBuy = false
    // These are Orders we need to convert them to OrderBookOrders by adding timestamp
    this.buyOrders = buyOrderDocuments;
    this.sellOrders = sellOrderDocuments;
  }

  /**
   * Fetch all in progress orders from the database
   */
  private async fetchOrdersByType(isBuy: boolean): Promise<OrderBookOrder[]> {
    const documents = await this.stockTransactionModel
      .find({
        order_type: "LIMIT",
        is_buy: isBuy,
        order_status: "IN_PROGRESS",
      })
      .sort({ price: isBuy ? -1 : 1, timestamp: 1 });

    const orders = documents.map((doc) => ({
      stock_tx_id: doc.stock_tx_id,
      user_id: doc.user_id,
      wallet_tx_id: doc.wallet_tx_id,
      price: doc.stock_price,
      quantity: doc.quantity,
      is_buy: doc.is_buy,
      order_type: doc.order_type,
      timestamp: doc.time_stamp,
      stock_id: doc.stock_id,
    }));
    return orders;
  }

  /**
   * Check for expired orders in the given Q and add them to the expiredOrders array
   */
  private checkQueueForExpiredOrders(orderQ: OrderBookOrder[]) {
    const now = new Date();
    for (let i = 0; i < orderQ.length; i++) {
      if (now.getTime() - orderQ[i].timestamp.getTime() > 60 * 15 * 1000) {
        this.expiredOrders.push(orderQ.splice(i, 1)[0]);
        i--;
      }
    }
  }

  /**
   * Given a pair of matched orders, create a new matched order object
   */
  private createMatchedOrder(
    order: OrderBookOrder,
    matchAgainst: Order,
    quantity: number
  ) {
    return {
      buyOrder: order.is_buy ? order : matchAgainst,
      sellOrder: order.is_buy ? matchAgainst : order,
      quantity,
      matchPrice: matchAgainst.price,
      timestamp: new Date(),
    } as MatchedOrder;
  }

  /**
   * Find all matches for a given order and return the matched orders and the remaining quantity
   */
  private findMatches(order: OrderBookOrder): [MatchedOrder[], number] {
    const matched: MatchedOrder[] = [];
    let remainingQty = order.quantity;
    const orderQueue = order.is_buy ? this.sellOrders : this.buyOrders;

    for (let i = 0; i < orderQueue.length; i++) {
      const matchAgainst = orderQueue[i];
      if (this.isExpired(matchAgainst.timestamp)) {
        this.expiredOrders.push(orderQueue.splice(i, 1)[0]);
        i--;
        continue;
      }
      if (remainingQty <= 0 || !this.isMatch(order, matchAgainst)) {
        break;
      }

      const matchedQuantity = Math.min(remainingQty, matchAgainst.quantity);
      remainingQty -= matchedQuantity;
      matchAgainst.quantity -= matchedQuantity;

      const matchedOrderPair = this.createMatchedOrder(
        order,
        matchAgainst,
        matchedQuantity
      );
      matched.push(matchedOrderPair);
      if (matchAgainst.quantity === 0) {
        orderQueue.splice(i, 1);
        i--;
      }
    }

    return [matched, remainingQty];
  }

  /**
   * Check if a given order matches against a given order in the orderbook
   */
  private isMatch(order: OrderBookOrder, matchAgainst: OrderBookOrder) {
    if (order.stock_id !== matchAgainst.stock_id) return false;
    return order.is_buy
      ? matchAgainst.price <= order.price
      : matchAgainst.price >= order.price;
  }

  /**
   * Handle remaining quantity of a partially filled order by pushing it into the orderbook
   */
  private handlePartialOrder(order: OrderBookOrder, remainingQty: number) {
    if (remainingQty > 0 && order.quantity !== remainingQty) {
      order.quantity = remainingQty;
      this.insertToOrderBook(order);
    }
  }

  /**
   * Compare an Order and OrderBookOrder and return true if they are the same
   */
  private isSameOrder(stockTxId: string, orderBookOrder: OrderBookOrder) {
    return stockTxId === orderBookOrder.stock_tx_id;
  }

  /**
   * Remove a given order from a given order queue
   */
  private removeOrderFromQueue(
    stockTxId: string,
    orderQueue: OrderBookOrder[]
  ): OrderBookOrder | null {
    for (let i = 0; i < orderQueue.length; i++) {
      if (this.isSameOrder(stockTxId, orderQueue[i])) {
        return orderQueue.splice(i, 1)[0];
      }
    }
    return null;
  }

  /**
   * Match a limit order against the orderbook and return the matched orders
   */
  private matchLimitOrder(newOrder: OrderBookOrder): [MatchedOrder[], number] {
    const [matchedOrders, remainingQty] = this.findMatches(newOrder);
    this.handlePartialOrder(newOrder, remainingQty);
    this.insertMatchedOrders(matchedOrders);
    return [matchedOrders, remainingQty];
  }

  /**
   * Insert a new order into the orderbook and resort
   */
  private insertToOrderBook(order: OrderBookOrder) {
    if (order.is_buy) {
      this.buyOrders.push(order);
    } else {
      this.sellOrders.push(order);
    }
    this.resortOrders();
  }

  /**
   * Send matched, cancelled, expired orders to order execution service
   */
  private async sendOrdersToOrderExecutionService(
    matchedOrders: MatchedOrder[],
    cancelledOrders: OrderBookOrder[],
    expiredOrders: OrderBookOrder[]
  ) {
    const executionServiceUrl = "http://ms_order_execution:8002/executeOrder";

    const data = [];

    if (matchedOrders.length > 0) {
      for (const matchedOrder of matchedOrders) {
        const buyStockTxId = matchedOrder.buyOrder.stock_tx_id;
        const sellStockTxId = matchedOrder.sellOrder.stock_tx_id;
        data.push({ stock_tx_id: buyStockTxId, action: "COMPLETED" });
        data.push({ stock_tx_id: sellStockTxId, action: "COMPLETED" });
      }
    }

    if (cancelledOrders.length > 0) {
      for (const cancelledOrder of cancelledOrders) {
        data.push({
          stock_tx_id: cancelledOrder.stock_tx_id,
          action: "CANCELLED",
        });
      }
    }

    if (expiredOrders.length > 0) {
      for (const expiredOrder of expiredOrders) {
        data.push({ stock_tx_id: expiredOrder.stock_tx_id, action: "EXPIRED" });
      }
    }

    try {
      const response = await axios.post(executionServiceUrl, {
        data,
      });

      if (response.status === 200) {
        this.matchedOrders = [];
        this.cancelledOrders = [];
        this.expiredOrders = [];
      }
    } catch (error) {
      console.error("Error sending orders to order execution service:", error);
    }
  }
}
