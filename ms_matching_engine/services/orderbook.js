const StockTransaction = require('../models/stockTransactionModel');
module.exports = class OrderBook {
    constructor() {
        this.buyOrders = [];
        this.sellOrders = [];
        this.matchedOrders = [];
    }

    async loadOrders() {
        // status = IN_PROGRESS/COMPLETED/CANCELLED/MATCHED
        // order_type = LIMIT/market
        // is_buy = true/false
        console.log("Loading orders from db")
        this.buyOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: true, order_status: "IN_PROGRESS" }).sort({ stock_price: -1 });
        this.sellOrders = await StockTransaction.find({ order_type: "LIMIT", is_buy: false, order_status: "IN_PROGRESS" }).sort({ stock_price: 1 });
        this.buyOrders.map(order => console.log("Buy order", order.stock_price, order.quantity));
        this.sellOrders.map(order => console.log("Sell order", order.stock_price, order.quantity));
    }

    async saveOrders() {
        // after matching and updating order status, save to db
        for (const order of this.matchedOrders) {
            await StockTransaction.findByIdAndUpdate(order._id, { order_status: "MATCHED" });
        }
    }

    matchOrders() {
        let matchFound = true;
        while (matchFound && this.buyOrders.length > 0 && this.sellOrders.length > 0) {
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
    }
    

}