
stock_transactions_keys = ['order_status', 'is_buy', 'order_type', 'stock_price', 'quantity']
wallet_transactions_keys = ['is_debit', 'amount']
stock_portfolio_keys = ['stock_name', 'quantity_owned']
stock_prices_keys = ['stock_name', 'current_price']

expected_results = {
    1: {"success": True, "data": None},
    2: {"success": False, "data": {"error": "<errorMessage>"}},
    3: {"success": False, "data": {"error": "<errorMessage>"}},
    4: {"success": True, "data": {"token": "<compToken>"}},
    5: {"success": True, "data": {"stock_id": "<googleStockId>"}},
    6: {"success": True, "data": None},
    7: {"success": True, "data": {"stock_id": "<appleStockId>"}},
    8: {"success": True, "data": None},
    9: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "quantity_owned": 550},
        {"stock_id": "<appleStockId>", "stock_name": "Apple", "quantity_owned": 369}
    ]},
    10: {"success": True, "data": None},
    11: {"success": True, "data": None},
    12: {"success": True, "data": []},
    13: {"success": True, "data": [
        {"stock_tx_id": "<appleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<appleStockId>", "wallet_tx_id": "<appleCompWalletTxId>", "order_status": "IN_PROGRESS", "is_buy": False, "order_type": "LIMIT", "stock_price": 140, "quantity": 369, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": "<googleCompWalletTxId>", "order_status": "IN_PROGRESS", "is_buy": False, "order_type": "LIMIT", "stock_price": 135, "quantity": 550, "time_stamp": "<timestamp>"}
        
    ]},
    14: {"success": True, "data": None},
    15: {"success": True, "data": {"token": "<user1Token>"}},
    16: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "current_price": 135},
        {"stock_id": "<appleStockId>", "stock_name": "Apple", "current_price": 140}
    ]},
    17: {"success": True, "data": None},
    18: {"success":True,"data":{"balance":10000}},
    19: {"success": True, "data": None},
    20: {"success":True,
        "data":[{"stock_tx_id":"<googleStockTxId>",
        "parent_stock_tx_id":None,
        "stock_id":"<googleStockId>",
        "wallet_tx_id":"<googleWalletTxId>",
        "order_status":"COMPLETED",
        "is_buy":True,
        "order_type":"MARKET",
        "stock_price":135,"quantity":10,"time_stamp":"<timestamp>"}]},
    21: {
  "success": True,
  "data": [
    {
      "wallet_tx_id": "<googleWalletTxId>",
      "stock_tx_id": "<googleStockTxId>",
      "is_debit": True,
      "amount": 1350,
      "time_stamp": "<timestamp>"
    }
  ]
},
    22: {"success": True, "data": {"balance": 8650}},
    23: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "quantity_owned": 10}
    ]},
    24: {"success": True, "data": [
        {"stock_tx_id": "<googleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": None, "order_status": "PARTIAL_FULFILLED", "is_buy": False, "order_type": "LIMIT", "stock_price": 135, "quantity": 550, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<appleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<appleStockId>", "wallet_tx_id": None, "order_status": "IN_PROGRESS", "is_buy": False, "order_type": "LIMIT", "stock_price": 140, "quantity": 369, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId2>", "parent_stock_tx_id": "<googleCompStockTxId>", "stock_id": "<googleStockId>", "wallet_tx_id": "<googleCompWalletTxId>", "order_status": "COMPLETED", "is_buy": False, "order_type": "MARKET", "stock_price": 135, "quantity": 10, "time_stamp": "<timestamp>"}
    ]},
    25: {"success": True, "data": {"balance": 1350}},
    26: {"success": True, "data": [
        {"wallet_tx_id": "<googleCompWalletTxId>", "stock_tx_id": "<googleCompStockTxId2>", "is_debit": False, "amount": 1350, "time_stamp": "<timestamp>"}
    ]},
    27: {"success": True, "data": None},
    28: {
        "success": True,
        "data": [
            {
            "stock_tx_id": "<googleStockTxId>",
            "parent_stock_tx_id": None,
            "stock_id": "<googleStockId>",
            "wallet_tx_id": "<googleWalletTxId>",
            "order_status": "COMPLETED",
            "is_buy": True,
            "order_type": "MARKET",
            "stock_price": 135,
            "quantity": 10,
            "time_stamp": "<timestamp>"
            },
            {
            "stock_tx_id": "<appleStockTxId>",
            "parent_stock_tx_id": None,
            "stock_id": "<appleStockId>",
            "wallet_tx_id": "<appleWalletTxId>",
            "order_status": "IN_PROGRESS",
            "is_buy": True,
            "order_type": "LIMIT",
            "stock_price": 120,
            "quantity": 20,
            "time_stamp": "<timestamp>"
            }
        ]
        },
    29: {"success": True, "data": [
        {"wallet_tx_id": "<googleWalletTxId>", "stock_tx_id": "<googleStockTxId>", "is_debit": True, "amount": 1350, "time_stamp": "<timestamp>"},
        {"wallet_tx_id": "<appleWalletTxId>", "stock_tx_id": "<appleStockTxId>", "is_debit": True, "amount": 2400, "time_stamp": "<timestamp>"}
    ]},
    30: {"success": True, "data": {"balance": 6250}},
    31: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "quantity_owned": 10}
    ]},
    32: {"success": True, "data": None},
    33: {"success": True, "data": [
        {"stock_tx_id": "<googleStockTxId>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": "<googleWalletTxId>", "order_status": "COMPLETED", "is_buy": True, "order_type": "MARKET", "stock_price": 135, "quantity": 10, "time_stamp": "<timestamp>"}
    ]},
    34: {"success": True, "data": [
        {"wallet_tx_id": "<googleWalletTxId>", "stock_tx_id": "<googleStockTxId>", "is_debit": True, "amount": 1350, "time_stamp": "<timestamp>"}
    ]},
    35: {"success": True, "data": {"balance": 8650}},
    36: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "quantity_owned": 10}
    ]},
    37: {"success": True, "data": None},
    38: {
  "success": True,
  "data": [
    {
      "stock_tx_id": "<googleStockTxId>",
      "parent_stock_tx_id": None,
      "stock_id": "<googleStockId>",
      "wallet_tx_id": "<googleWalletTxId>",
      "order_status": "COMPLETED",
      "is_buy": True,
      "order_type": "MARKET",
      "stock_price": 135,
      "quantity": 10,
      "time_stamp": "<timestamp>"
    },
    {
      "stock_tx_id": "<googleStockTxId2>",
      "parent_stock_tx_id": None,
      "stock_id": "<googleStockId>",
      "wallet_tx_id": "<googleWalletTxId2>",
      "order_status": "IN_PROGRESS",
      "is_buy": False,
      "order_type": "LIMIT",
      "stock_price": 134,
      "quantity": 4,
      "time_stamp": "<timestamp>"
    }
  ]
},
    39: {"success": True, "data": [
        {"wallet_tx_id": "<googleWalletTxId>", "stock_tx_id": "<googleStockTxId>", "is_debit": True, "amount": 1350, "time_stamp": "<timestamp>"}
    ]},
    40: {"success": True, "data": {"balance": 8650}},
    41: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "quantity_owned": 6}
    ]},
    42: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "current_price": 135},
        {"stock_id": "<appleStockId>", "stock_name": "Apple", "current_price": 140}
    ]},
    43: {"success": True, "data": None},
    44: {"success": True, "data": [
        {"stock_tx_id": "<appleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<appleStockId>", "wallet_tx_id": None, "order_status": "IN_PROGRESS", "is_buy": False, "order_type": "LIMIT", "stock_price": 140, "quantity": 369, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": None, "order_status": "PARTIAL_FULFILLED", "is_buy": False, "order_type": "LIMIT", "stock_price": 135, "quantity": 550, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId2>", "parent_stock_tx_id": "<googleCompStockTxId>", "stock_id": "<googleStockId>", "wallet_tx_id": "<googleCompWalletTxId>", "order_status": "COMPLETED", "is_buy": False, "order_type": "MARKET", "stock_price": 135, "quantity": 10, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId3>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": "<googleCompWalletTxId2>", "order_status": "COMPLETED", "is_buy": True, "order_type": "LIMIT", "stock_price": 134, "quantity": 4, "time_stamp": "<timestamp>"}
    ]},
    45: {"success": True, "data": [
        {"wallet_tx_id": "<googleCompWalletTxId>", "stock_tx_id": "<googleCompStockTxId2>", "is_debit": False, "amount": 1350, "time_stamp": "<timestamp>"},
        {"wallet_tx_id": "<googleCompWalletTxId2>", "stock_tx_id": "<googleCompStockTxId3>", "is_debit": True, "amount": 536, "time_stamp": "<timestamp>"}
    ]},
    46: {"success": True, "data": {"balance": 814}},
    47: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "current_price": 134},
        {"stock_id": "<appleStockId>", "stock_name": "Apple", "current_price": 140}
    ]},
    48: {"success": True, "data": [
        {"stock_tx_id": "<googleStockTxId>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": "<googleWalletTxId>", "order_status": "COMPLETED", "is_buy": True, "order_type": "MARKET", "stock_price": 135, "quantity": 10, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleStockTxId2>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": "<googleWalletTxId2>", "order_status": "COMPLETED", "is_buy": False, "order_type": "LIMIT", "stock_price": 134, "quantity": 4, "time_stamp": "<timestamp>"}
    ]},
    49: {"success": True, "data": [
        {"wallet_tx_id": "<googleWalletTxId>", "stock_tx_id": "<googleStockTxId>", "is_debit": True, "amount": 1350, "time_stamp": "<timestamp>"},
        {"wallet_tx_id": "<googleWalletTxId2>", "stock_tx_id": "<googleStockTxId2>", "is_debit": False, "amount": 536, "time_stamp": "<timestamp>"}
    ]},
    50: {"success": True, "data": {"balance": 9186}},
    51: {"success": True, "data": [
        {"stock_tx_id": "<googleCompStockTxId>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": None, "order_status": "PARTIAL_FULFILLED", "is_buy": False, "order_type": "LIMIT", "stock_price": 135, "quantity": 550, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId2>", "parent_stock_tx_id": "<googleCompStockTxId>", "stock_id": "<googleStockId>", "wallet_tx_id": "<googleCompWalletTxId>", "order_status": "COMPLETED", "is_buy": False, "order_type": "MARKET", "stock_price": 135, "quantity": 10, "time_stamp": "<timestamp>"},
        {"stock_tx_id": "<googleCompStockTxId3>", "parent_stock_tx_id": None, "stock_id": "<googleStockId>", "wallet_tx_id": "<googleCompWalletTxId2>", "order_status": "COMPLETED", "is_buy": True, "order_type": "LIMIT", "stock_price": 134, "quantity": 4, "time_stamp": "<timestamp>"}
    ]},
    52: {"success": True, "data": [
        {"stock_id": "<googleStockId>", "stock_name": "Google", "quantity_owned": 544},
        {"stock_id": "<appleStockId>", "stock_name": "Apple", "quantity_owned": 369}
    ]},
    53: {"success": False, "data": {"error": "<errorMessage>"}},
    54: {"success": False, "data": {"error": "<errorMessage>"}},
    55: {"success": False, "data": {"error": "<errorMessage>"}},
    56: {"success": False, "data": {"error": "<errorMessage>"}},
    57: {"success": False, "data": {"error": "<errorMessage>"}},
    58: {"success": False, "data": {"error": "<errorMessage>"}},
    59: {"success": False, "data": {"error": "<errorMessage>"}},
    60: {"success": False, "data": {"error": "<errorMessage>"}}
}
