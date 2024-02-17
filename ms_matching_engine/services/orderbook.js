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
        const matchQueue = order.is_buy ? this.sellOrders : this.buyOrders;
        this.resort();

        const remainingQty = order.quantity;

        for (let i = 0; i < matchQueue.length && remainingQty; i++) {
            const matchAgainst = matchQueue[i];

            if (
                (order.is_buy && matchAgainst.stock_price > order.stock_price) ||
                (!order.is_buy && matchAgainst.stock_price < order.stock_price)
            ) {
                break;
            }

            const matchedQuantity = Math.min(remainingQuantity, matchAgainst.quantity);
            remainingQuantity -= matchedQuantity;
            matchAgainst.quantity -= matchedQuantity;

            const matchedOrder = {
                buyOrder: newOrder.is_buy ? newOrder : matchAgainst,
                sellOrder: newOrder.is_buy ? matchAgainst : newOrder,
                quantity: matchedQuantity,
                matchPrice: matchAgainst.stock_price,
                timestamp: new Date() // might not need this idk
            };

            this.matchedOrders.push(matchedOrder);

            // If fully matched remove from order book
            if (matchAgainst.quantity === 0) {
                matchAgainst.splice(i, 1);
                i--; // to account for the removed order
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