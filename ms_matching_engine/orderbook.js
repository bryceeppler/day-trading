class OrderBook {
    constructor(db) {
        this.buyOrders = [];
        this.sellOrders = [];
        this.matchedOrders = [];
        // this.loadOrders(db);

    }

    async loadOrders(db) {
        // load orders from db
        // maybe sort on the mongo query if we end up needing it later
        const buyOrders = await db.ordersCollection.find({ type: "buy" }).toArray(); 
        const sellOrders = await db.ordersCollection.find({ type: "sell" }).toArray();
        const matchedOrders = await db.ordersCollection.find({ type: "matched" }).toArray();
        this.buyOrders = buyOrders;
        this.sellOrders = sellOrders;
        this.matchedOrders = matchedOrders;
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

    async saveOrders(db) {
        try {
            // TODO: we'll need to clear the collection first
            await db.ordersCollection.insertMany(this.buyOrders);
            await db.ordersCollection.insertMany(this.sellOrders);
            await db.ordersCollection.insertMany(this.matchedOrders);
            console.log("Orders saved to db")
        } catch (error) {
            console.error("Error saving orders to db:", error);
        }
    }

    matchOrders() {
        return;
    }

}