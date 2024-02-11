const StockTransaction = require('../models/stockTransactionModel');
const axios = require('axios');
module.exports = class OrderBook {
    constructor() {
        this.buyOrders = [];
        this.sellOrders = [];
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
        this.buyOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: true, order_status: "IN_PROGRESS" }).sort({ time_stamp: 1 });
        this.sellOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: false, order_status: "IN_PROGRESS" }).sort({ time_stamp: 1 });
    }


    matchOrders() {
        let matchFound = true;

        while (matchFound && this.buyOrders.length > 0 && this.sellOrders.length > 0) {


            // Check if match
            if (this.buyOrders[0].stock_price >= this.sellOrders[0].stock_price) {
                // TODO add partial order fills
                console.log(`Matching order: ${this.buyOrders[0]._id} with ${this.sellOrders[0]._id}`);
    
                // move to matchedOrders array
                this.matchedOrders.push(this.buyOrders.shift(), this.sellOrders.shift());
            } else {
                matchFound = false; // stop if the top buy order cannot match the top sell order
            }

        }
        console.log("Num of matched orders", this.matchedOrders.length);
        console.log("Num of expired orders", this.expiredOrders.length);
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
            this.buyOrders.push(order);
        }
        else {
            this.sellOrders.push(order);
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