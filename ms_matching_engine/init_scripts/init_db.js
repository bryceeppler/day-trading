// Switch to the 'day-trading-db' database
db = db.getSiblingDB('day-trading-db');

// Create the 'stockTransactions' collection
db.createCollection('stockTransactions');

// Insert 5 stock order documents into the 'stockTransactions' collection
db.stockTransactions.insertMany([
  {
    stock_id: "65cd22fe26a6c68f2cad76bb",
    wallet_tx_id: ObjectId(),
    order_status: "IN_PROGRESS", // Assuming 'IN_PROGRESS' is a valid value from ORDER_STATUS
    is_buy: true,
    order_type: "LIMIT", // Assuming 'LIMIT' is a valid value from ORDER_TYPE
    stock_price: 100.0,
    quantity: 5,
    time_stamp: new Date(),
    is_deleted: false
  },
  {
    stock_id: "65cd22fe26a6c68f2cad76bb",
    wallet_tx_id: ObjectId(),
    order_status: "COMPLETED", // Example value
    is_buy: false,
    order_type: "MARKET", // Example value
    stock_price: 150.0,
    quantity: 10,
    time_stamp: new Date(),
    is_deleted: false
  },
  {
    stock_id: "65cd22fe26a6c68f2cad76bb",
    wallet_tx_id: ObjectId(),
    order_status: "CANCELLED", // Example value
    is_buy: true,
    order_type: "STOP_LOSS", // Example value
    stock_price: 75.5,
    quantity: 20,
    time_stamp: new Date(),
    is_deleted: false
  },
  {
    stock_id: "65cd22fe26a6c68f2cad76bb",
    wallet_tx_id: ObjectId(),
    order_status: "IN_PROGRESS",
    is_buy: false,
    order_type: "LIMIT",
    stock_price: 200.0,
    quantity: 2,
    time_stamp: new Date(),
    is_deleted: false
  },
  {
    stock_id: "65cd22fe26a6c68f2cad76bb",
    wallet_tx_id: ObjectId(),
    order_status: "COMPLETED",
    is_buy: true,
    order_type: "MARKET",
    stock_price: 50.0,
    quantity: 50,
    time_stamp: new Date(),
    is_deleted: false
  }
]);
