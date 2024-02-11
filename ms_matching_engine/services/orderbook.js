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
        console.log("Loading orders from db")
        let allBuyOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: true, order_status: "IN_PROGRESS" }).sort({ stock_price: -1, time_stamp: 1 });
        let allSellOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: false, order_status: "IN_PROGRESS" }).sort({ stock_price: 1, time_stamp: 1 });

        this.buyOrders = allBuyOrders;
        this.sellOrders = allSellOrders;
    }

    matchOrders() {
        // define output buy order queue and sell order queue for unmatched orders that can be used as input for the next matching
        // const unmatchedBuyOrders = [];
        // const unmatchedSellOrders = [];
        while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
            const buyOrder = this.buyOrders[0];
            const sellOrder = this.sellOrders[0];
            // Check if the first buy order's price is at least equal to the first sell order's price
            if (buyOrder.stock_price >= sellOrder.stock_price) {
                const qty = Math.min(buyOrder.quantity, sellOrder.quantity);
                console.log(`Matching order: ${buyOrder._id} with ${sellOrder._id} for ${qty} shares at ${buyOrder.stock_price}`);
                
                // update available quanities
                buyOrder.quantity -= qty;
                sellOrder.quantity -= qty;

                this.matchedOrders.push(
                    {
                        buy_order: buyOrder,
                        sell_order: sellOrder,
                        quantity: qty,
                    }
                );

                // if no qty left, remove from queue
                if (buyOrder.quantity === 0) {
                    this.buyOrders.shift();
                }
                if (sellOrder.quantity === 0) {
                    this.sellOrders.shift();
                }
    
            } else {
                // increment the index of the order that is not matched
                if (buyOrder.stock_price < sellOrder.stock_price) {
                    this.buyOrders.shift();
                }
                else {
                    this.sellOrders.shift();
                }


                // we don't want to shift it into the ether, we want it to be stored as the input queue
                // on the next iteration

                // if (buyOrder.stock_price < sellOrder.stock_price) {
                //     unmatchedBuyOrders.push(this.buyOrders.shift());
                // } else {
                //     unmatchedSellOrders.push(this.sellOrders.shift());
                // }

                // if we are totally out of buy or sell orders, reset the buyOrders and sellOrders arrays to the unmatched orders
                // combined with the remaining orders in the other array
                // if (this.buyOrders.length === 0) {
                //     this.buyOrders = unmatchedBuyOrders;
                //     this.sellOrders = this.sellOrders.concat(unmatchedSellOrders);
                // }
                // if (this.sellOrders.length === 0) {
                //     this.buyOrders = this.buyOrders.concat(unmatchedBuyOrders);
                //     this.sellOrders = unmatchedSellOrders;
                // }

            }
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
        // add to proper orderbook array
        // orderbook array is sorted by time_stamp, so this will be at the end no matter what
        // if (order.is_buy) {
        //     if (!this.buyOrders[order.stock_id]) {
        //         this.buyOrders[order.stock_id] = [];
        //     }
        //     this.buyOrders[order.stock_id].push(order);
        // } else {
        //     if (!this.sellOrders[order.stock_id]) {
        //         this.sellOrders[order.stock_id] = [];
        //     }
        //     this.sellOrders[order.stock_id].push(order);
        // } 
        // console.log("Number of buy orders after insert", this.buyOrders[order.stock_id].length);
        // console.log("Number of sell orders after insert", this.sellOrders[order.stock_id].length);

        if (order.is_buy) {
            // add to buy orders at proper index, it is already sorted by price and time
            this.buyOrders.push(order);
        }
        else {
            this.sellOrders.push(order);
        }
        console.log("Number of buy orders after insert", this.buyOrders.length);
    }

    async sendOrdersToOrderExecutionService(
        matchedOrders,
        cancelledOrders,
        expiredOrders
    ) {
        // log the orders to be sent to order execution service
        console.log("Sending orders to order execution service");
        // console.log("Matched orders:", matchedOrders);
        // console.log("Cancelled orders:", cancelledOrders);
        // console.log("Expired orders:", expiredOrders);

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