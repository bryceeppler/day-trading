function createMockStockTransactionModel(buyOrders = [], sellOrders = []) {
  function sortOrders(orders, isBuyOrder) {
      return orders.sort((a, b) => {
          // Sorting by stock_price in descending order for buy orders and ascending for sell orders
          if (isBuyOrder) {
              if (a.stock_price === b.stock_price) {
                  return new Date(a.time_stamp) - new Date(b.time_stamp); // earliest first if prices are equal
              }
              return b.stock_price - a.stock_price;
          } else {
              if (a.stock_price === b.stock_price) {
                  return new Date(a.time_stamp) - new Date(b.time_stamp); // earliest first if prices are equal
              }
              return a.stock_price - b.stock_price;
          }
      });
  }

  return {
      find: jest.fn().mockImplementation(query => ({
          sort: jest.fn().mockImplementation(() => {
              if (query.is_buy) {
                  return Promise.resolve(sortOrders(buyOrders, true));
              } else {
                  return Promise.resolve(sortOrders(sellOrders, false));
              }
          })
      }))
  };
}



const OrderBook = require('../services/orderbook');


describe('OrderBook', () => {
    let mockBuyOrders, mockSellOrders;

    beforeEach(() => {
        mockBuyOrders = [
            {
                _id: "buy1",
                stock_id: "1",
                stock_price: 101,
                quantity: 5,
                is_buy: true,
                time_stamp: "2021-08-12T18:00:00.000Z",
            },
            {
                _id: "buy2",
                stock_id: "1",
                stock_price: 100,
                quantity: 5,
                is_buy: true,
                time_stamp: "2021-08-12T17:00:00.000Z",
            },
        ];

        mockSellOrders = [
            {
                _id: "sell1",
                stock_id: "1",
                stock_price: 102,
                quantity: 5,
                is_buy: false,
                time_stamp: "2021-08-12T19:00:00.000Z",
            },
            {
              _id: "sell2",
              stock_id: "1",
              stock_price: 101,
              quantity: 5,
              is_buy: false,
              time_stamp: "2021-08-12T19:00:00.000Z",
          },

        ];

        this.mockStockTransactionModel = createMockStockTransactionModel(mockBuyOrders, mockSellOrders);
    });

    it('loads orders correctly', async () => {
        const orderbook = new OrderBook(this.mockStockTransactionModel);
        await orderbook.init();

        expect(orderbook.buyOrders).toEqual(mockBuyOrders);
        expect(orderbook.sellOrders).toEqual(mockSellOrders);
    });

    it('matches orders correctly', async () => {
        const orderbook = new OrderBook(this.mockStockTransactionModel);
        await orderbook.init();
        orderbook.matchOrders();

        // check matchedorders.length = 1
        expect(orderbook.matchedOrders.length).toBe(1);
        expect(orderbook.matchedOrders[0].buy_order._id).toEqual("buy1");
      });
    }
  );

