const StockTransaction = require('../models/stockTransactionModel');
const axios = require('axios');
module.exports = class OrderBook {
    constructor() {
        this.buyOrders = {};
        this.sellOrders = {};
        this.matchedOrders = [];
        this.cancelledOrders = [];
        this.expiredOrders = [];
        this.init();
    }

    async init() {
        await this.loadOrders();
    }

    async loadOrders() {
        // status = IN_PROGRESS/COMPLETED/CANCELLED/MATCHED
        // order_type = LIMIT/market
        // is_buy = true/false
        console.log("Loading orders from db")
        let allBuyOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: true, order_status: "IN_PROGRESS" }).sort({ time_stamp: 1 });
        let allSellOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: false, order_status: "IN_PROGRESS" }).sort({ time_stamp: 1 });

        this.buyOrders = this.groupOrdersByStock(allBuyOrders);
        this.sellOrders = this.groupOrdersByStock(allSellOrders);
    }

    groupOrdersByStock(orders) {
        return orders.reduce((acc, order) => {
            if (!acc[order.stock_id]) {
                acc[order.stock_id] = [];
            }
            acc[order.stock_id].push(order);
            return acc;
        }, {});
    }

    matchOrders() {
        for (const stock in this.buyOrders) {
            let buyQueue = this.buyOrders[stock];
            let sellQueue = this.sellOrders[stock] || [];

            let matchFound = buyQueue.length > 0 && sellQueue.length > 0;

            while (matchFound) {
                let buyOrder = buyQueue[0];
                let sellOrder = sellQueue[0];

                // Check for price match
                if (buyOrder.stock_price >= sellOrder.stock_price) {
                    console.log(`Matching order: ${buyOrder._id} with ${sellOrder._id}`);
                    // TODO: partial fills

                    // moving to matchedOrders
                    this.matchedOrders.push(buyQueue.shift(), sellQueue.shift());
                    matchFound = buyQueue.length > 0 && sellQueue.length > 0;
                } else {
                    matchFound = false; // no match, move to next stock
                }
            }
        }

        console.log("Num of matched orders", this.matchedOrders.length);
    }


    flushOrders() {
        // send matched, cancelled, expired orders to order execution service
        console.log("Flushing orders");
        this.sendOrdersToOrderExecutionService(
            this.matchedOrders,
            this.cancelledOrders,
            this.expiredOrders
        );
    }

    insertOrder(order) {
        // add to proper orderbook array
        // orderbook array is sorted by time_stamp, so this will be at the end no matter what
        if (order.is_buy) {
            if (!this.buyOrders[order.stock_id]) {
                this.buyOrders[order.stock_id] = [];
            }
            this.buyOrders[order.stock_id].push(order);
        } else {
            if (!this.sellOrders[order.stock_id]) {
                this.sellOrders[order.stock_id] = [];
            }
            this.sellOrders[order.stock_id].push(order);
        } 
    }

    async sendOrdersToOrderExecutionService(
        matchedOrders,
        cancelledOrders,
        expiredOrders
    ) {
        // log the orders to be sent to order execution service
        console.log("Sending orders to order execution service");
        console.log("Matched orders:", matchedOrders);
        console.log("Cancelled orders:", cancelledOrders);
        console.log("Expired orders:", expiredOrders);

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

}