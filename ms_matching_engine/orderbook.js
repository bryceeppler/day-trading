class OrderBook {
    constructor() {
        this.buyOrders = [];
        this.sellOrders = [];
        this.matchedOrders = [];
    }

    addOrder(order) {
        if (order.type === 'buy') {
            this.buyOrders.push(order);
            // sort here maybe?
        } else {
            this.sellOrders.push(order);
            // sort?
        }
    }

    matchOrders() {
        return;
    }

}