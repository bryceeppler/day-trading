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

    resort() {
        this.buyOrders.sort((a, b) => a.stock_price - b.stock_price);
        this.sellOrders.sort((a, b) => a.stock_price - b.stock_price);
    }

    async init() {
        await this.loadOrders();
        console.log("Orderbook initialized with ", this.buyOrders.length, " buy orders and ", this.sellOrders.length, " sell orders...")
    }

    async loadOrders() {
        let allBuyOrders = await this.stockTransactionModel.find({ order_type: "LIMIT", is_buy: true, order_status: "IN_PROGRESS" }).sort({ stock_price: -1, time_stamp: 1 });
        let allSellOrders = await this.stockTransactionModel.find({ order_type: "LIMIT", is_buy: false, order_status: "IN_PROGRESS" }).sort({ stock_price: 1, time_stamp: 1 });

        this.buyOrders = allBuyOrders;
        this.sellOrders = allSellOrders;
    }

    checkForExpiredOrders() {
        // This is ugly but it does the job for now
        console.log("Checking for expired orders");
        const now = new Date();
        const expiredBuyOrders = this.buyOrders.filter(
            (order) => now - order.time_stamp > 1000 * 60 * 60 * 24
        );
        const expiredSellOrders = this.sellOrders.filter(
            (order) => now - order.time_stamp > 1000 * 60 * 60 * 24
        );

        this.expiredOrders = this.expiredOrders.concat(expiredBuyOrders, expiredSellOrders);
        this.buyOrders = this.buyOrders.filter(
            (order) => now - order.time_stamp <= 1000 * 60 * 60 * 24
        );
        this.sellOrders = this.sellOrders.filter(
            (order) => now - order.time_stamp <= 1000 * 60 * 60 * 24
        );
    }


    matchOrder(order) {
        const unmatchedBuyOrders = [];
        const unmatchedSellOrders = [];
        // we can just initialize one based off the order type
        const matchFound = false;
        while (this.buyOrders.length > 0 && this.sellOrders.length > 0) {
            const buyOrder = this.buyOrders[0];
            const sellOrder = this.sellOrders[0];
            // Check if the first buy order's price is at least equal to the first sell order's price
            if (buyOrder.stock_price >= sellOrder.stock_price) {
                const qty = Math.min(buyOrder.quantity, sellOrder.quantity);
                console.log(`Matching order: ${buyOrder._id} with ${sellOrder._id} for ${qty} shares at ${buyOrder.stock_price}`);
                matchFound = true;
                buyOrder.quantity -= qty;
                sellOrder.quantity -= qty;

                this.matchedOrders.push(
                    {
                        buy_order: buyOrder,
                        sell_order: sellOrder,
                        quantity: qty,
                    }
                );
                if (buyOrder.quantity === 0) {
                    this.buyOrders.shift();
                }
                if (sellOrder.quantity === 0) { 
                    this.sellOrders.shift();
                }
    
            } else {
                if (buyOrder.stock_price < sellOrder.stock_price) {
                    unmatchedBuyOrders.push(this.buyOrders.shift());
                } else {
                    unmatchedSellOrders.push(this.sellOrders.shift());
                }
            }
        }

        this.buyOrders = this.buyOrders.concat(unmatchedBuyOrders);
        this.sellOrders = this.sellOrders.concat(unmatchedSellOrders);

        this.resort();

        return matchFound

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
        if (order.is_buy) {
            // add to buy orders at proper index, it is already sorted by price and time
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

}