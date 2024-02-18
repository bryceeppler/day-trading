export enum OrderType {
    LIMIT = "LIMIT",
    MARKET = "MARKET"
  }
  
export interface Order {
    _id?: number;
    stock_id: string;
    stock_price: number;
    quantity: number;
    is_buy: boolean;
    type: OrderType;
  }
  
  export interface MatchedOrder {
    buyOrder: Order;
    sellOrder: Order;
    quantity: number;
    matchPrice: number;
    timestamp: Date;
  }
  
  export interface StockTransactionModel {
    find(query: object): Promise<Order[]>;
  }