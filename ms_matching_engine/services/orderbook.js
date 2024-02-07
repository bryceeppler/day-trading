const StockTransaction = require('../models/StockTransactionModel');
module.exports = class OrderBook {
    constructor() {
        this.buyOrders = [];
        this.sellOrders = [];
        this.matchedOrders = [];
    }

    async loadOrders() {
        // status = IN PROGRESS/COMPLETED/CANCELLED/MATCHED
        // order_type = limit/market
        // is_buy = true/false
        this.buyOrders = await StockTransaction.find({ order_type: "limit", is_buy: true, status: "IN PROGRESS" }).sort({ price: -1 });
        this.sellOrders = await StockTransaction.find({ order_type: "limit", is_buy: false, status: "IN PROGRESS" }).sort({ price: 1 });
    }

    async saveOrders() {
        // after matching and updating order status, save to db
        for (const order of this.matchedOrders) {
            await StockTransaction.findByIdAndUpdate(order._id, { status: "MATCHED" });
        }
    }

    matchOrders() {
        let matchFound = true;
        while (matchFound && this.buyOrders.length > 0 && this.sellOrders.length > 0) {
            if (this.buyOrders[0].price >= this.sellOrders[0].price) {
                // TODO add partial order fills
                console.log(`Matching order: ${this.buyOrders[0]._id} with ${this.sellOrders[0]._id}`);
    
                // move to matchedOrders array
                this.matchedOrders.push(this.buyOrders.shift(), this.sellOrders.shift());
            } else {
                matchFound = false; // stop if the top buy order cannot match the top sell order
            }
        }
    }
    

}