// test script to populate some dummy orders in the database

const testData = [
    // buy at 100
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "order_status": "IN_PROGRESS",
        "is_buy": true,
        "order_type": "LIMIT",
        "stock_price": 100,
        "quantity": 10,
        "time_stamp": "2021-06-04T07:00:00.000Z",
        "is_deleted": false
    },
    // buy at 90
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "order_status": "IN_PROGRESS",
        "is_buy": true,
        "order_type": "LIMIT",
        "stock_price": 90,
        "quantity": 10,
        "time_stamp": "2021-06-04T07:00:00.000Z",
        "is_deleted": false
    },
    // Existing sell order at 110
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "order_status": "IN_PROGRESS",
        "is_buy": false,
        "order_type": "LIMIT",
        "stock_price": 110,
        "quantity": 10,
        "time_stamp": "2021-06-04T07:00:00.000Z",
        "is_deleted": false
    },
    // sell at 120
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "order_status": "IN_PROGRESS",
        "is_buy": false,
        "order_type": "LIMIT",
        "stock_price": 120,
        "quantity": 10,
        "time_stamp": "2021-06-04T07:00:00.000Z",
        "is_deleted": false
    },
    // sell at 100 (should match first buy order0)
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e4",
        "order_status": "IN_PROGRESS",
        "is_buy": false,
        "order_type": "LIMIT",
        "stock_price": 100,
        "quantity": 5,
        "time_stamp": "2021-06-04T07:01:00.000Z",
        "is_deleted": false
    },
    // buy at 85 (no match, too low)
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e5",
        "order_status": "IN_PROGRESS",
        "is_buy": true,
        "order_type": "LIMIT",
        "stock_price": 85,
        "quantity": 10,
        "time_stamp": "2021-06-04T07:02:00.000Z",
        "is_deleted": false
    },
    // sell at 115, too high no match
    {
        "stock_id": "60b9e3e3e4e3f3e3e3e3e3e3",
        "wallet_tx_id": "60b9e3e3e4e3f3e3e3e3e3e6",
        "order_status": "IN_PROGRESS",
        "is_buy": false,
        "order_type": "LIMIT",
        "stock_price": 115,
        "quantity": 10,
        "time_stamp": "2021-06-04T07:03:00.000Z",
        "is_deleted": false
    }

];

const mongoose = require('mongoose');
const StockTransaction = require('../models/StockTransactionModel');
const connectDB = require('../config/database');

async function insertTestData() {
    await connectDB("mongodb://mongodb:mongodb@localhost:27017/db");
    await StockTransaction.insertMany(testData);
    console.log("Test data inserted successfully");
    mongoose.disconnect();
}

insertTestData();
