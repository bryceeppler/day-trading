const OrderBook = require('./orderbook');

sortOrderBook = (orderbook) => {
    orderbook.buyOrders.sort((a, b) => {
        if (a.stock_price === b.stock_price) {
            return a.time_stamp - b.time_stamp;
        }
        return b.stock_price - a.stock_price;
    });
    orderbook.sellOrders.sort((a, b) => {
        if (a.stock_price === b.stock_price) {
            return a.time_stamp - b.time_stamp;
        }
        return a.stock_price - b.stock_price;
    });
};


describe('OrderBook', () => {

    beforeEach(() => {
    });


    it('matches order correctly', async () => {
        const orderbook1 = new OrderBook();

        orderbook1.buyOrders = [
            { _id: 1, stock_id: "1", stock_price: 10, quantity: 5 },
        ];
        orderbook1.sellOrders = [
            { _id: 3, stock_id: "1", stock_price: 10, quantity: 5 },
        ];
        orderbook1.matchOrders();

        expect(orderbook1.matchedOrders.length).toBe(1);
      });


      it('matches multiple orders correctly', () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_id: "1", stock_price: 20, quantity: 5 },
            { _id: "buy2", stock_id: "1", stock_price: 15, quantity: 10 },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_id: "1", stock_price: 15, quantity: 5 },
            { _id: "sell2", stock_id: "1", stock_price: 10, quantity: 10 },
        ];
        orderbook.matchOrders();
    
        expect(orderbook.matchedOrders.length).toBe(2);
        expect(orderbook.buyOrders.length).toBe(0);
        expect(orderbook.sellOrders.length).toBe(0);
    });

    it('handles partial order matches correctly', () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_id:"1", stock_price: 10, quantity: 8 },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_id:"1", stock_price: 10, quantity: 5 },
        ];
        orderbook.matchOrders();
    
        expect(orderbook.matchedOrders.length).toBe(1);
        expect(orderbook.buyOrders[0].quantity).toBe(3);
        expect(orderbook.sellOrders.length).toBe(0);
    });

    it('does not match orders if sell price is higher than buy price', () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_id:"1", stock_price: 12, quantity: 5 },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_id:"1", stock_price: 15, quantity: 5 },
        ];
        orderbook.matchOrders();
    
        expect(orderbook.matchedOrders.length).toBe(0);
        expect(orderbook.buyOrders.length).toBe(1);
        expect(orderbook.sellOrders.length).toBe(1);
    });

    it('matches orders based on FIFO for same price', () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_price: 10, quantity: 5, time_stamp: new Date('2020-01-01') },
            { _id: "buy2", stock_price: 10, quantity: 5, time_stamp: new Date('2020-01-02') },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_price: 10, quantity: 5, time_stamp: new Date('2020-01-03') },
        ];

        sortOrderBook(orderbook);
        
        orderbook.matchOrders();
    
        expect(orderbook.matchedOrders.length).toBe(1);
        expect(orderbook.matchedOrders[0].buy_order._id).toEqual("buy1");
        expect(orderbook.buyOrders.length).toBe(1);
        expect(orderbook.buyOrders[0]._id).toEqual("buy2");
    });
    
    it('fully matches and removes orders with exact quantity and price match', () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_price: 10, quantity: 10 },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_price: 10, quantity: 10 },
        ];
        orderbook.matchOrders();
    
        expect(orderbook.matchedOrders.length).toBe(1);
        expect(orderbook.buyOrders.length).toBe(0);
        expect(orderbook.sellOrders.length).toBe(0);
    });
    it('correctly matches orders for multiple stock_ids without cross-matching', () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_id: "1", stock_price: 20, quantity: 5 },
            { _id: "buy2", stock_id: "2", stock_price: 30, quantity: 10 },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_id: "1", stock_price: 20, quantity: 5 },
            { _id: "sell2", stock_id: "2", stock_price: 30, quantity: 10 },
        ];
        
        orderbook.matchOrders();
    
        // one match per stock, with no cross-matching between stocks
        expect(orderbook.matchedOrders.length).toBe(2);
        expect(orderbook.matchedOrders.find(o => o.buy_order.stock_id === "1" && o.sell_order.stock_id === "1")).toBeDefined();
        expect(orderbook.matchedOrders.find(o => o.buy_order.stock_id === "2" && o.sell_order.stock_id === "2")).toBeDefined();
        expect(orderbook.buyOrders.length).toBe(0);
        expect(orderbook.sellOrders.length).toBe(0);
    });
    
    it('correctly handles partial fills for orders', () => {
        const orderbook = new OrderBook();
        // buy order with larger quantity than the sell order
        orderbook.buyOrders = [
            { _id: "buy1", stock_id: "1", stock_price: 20, quantity: 15 },
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_id: "1", stock_price: 20, quantity: 10 },
        ];
        
        orderbook.matchOrders();
    
        // sell order should be fully matched and removed, while the buy order remains with reduced quantity
        expect(orderbook.matchedOrders.length).toBe(1);
        expect(orderbook.buyOrders.length).toBe(1);
        expect(orderbook.sellOrders.length).toBe(0);

        expect(orderbook.buyOrders[0].quantity).toBe(5);    // 15 - 10 = 5
    });
    
    it('accurately matches multiple orders for different stocks, including partial fills, without cross-matching', async () => {
        const orderbook = new OrderBook();
        orderbook.buyOrders = [
            { _id: "buy1", stock_id: "A", stock_price: 100, quantity: 20 },
            { _id: "buy2", stock_id: "A", stock_price: 95, quantity: 15 },
            { _id: "buy3", stock_id: "B", stock_price: 50, quantity: 25 },
            { _id: "buy4", stock_id: "C", stock_price: 75, quantity: 5 },
            { _id: "buy5", stock_id: "C", stock_price: 75, quantity: 20 }, // partial match
        ];
        orderbook.sellOrders = [
            { _id: "sell1", stock_id: "A", stock_price: 100, quantity: 20 },
            { _id: "sell2", stock_id: "B", stock_price: 50, quantity: 25 },
            { _id: "sell3", stock_id: "C", stock_price: 75, quantity: 10 }, // partial fill on buy5
            { _id: "sell4", stock_id: "C", stock_price: 70, quantity: 15 }, // 
        ];

        sortOrderBook(orderbook);
    
        orderbook.matchOrders();

        // fail 
        expect(false).toBe(true);
    
    });
    
    }
  );


