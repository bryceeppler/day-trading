import requests
import time 
import json
import os
from test_data import expected_results, stock_transactions_keys, wallet_transactions_keys, stock_portfolio_keys, stock_prices_keys
from datetime import datetime, timedelta

BASE_URL = "http://localhost" #:8000/



# | Port  | Service  |
# |-------|---------------|
# | 8001  | ms_user |
# | 8002  | ms_order_execution |
# | 8003  | ms_order_creation |
# | 8004  | ms_matching_engine |
# | 8005  | ms_market_data |
# | 8006  | ms_transaction_manager |
ENDPOINTS = {
    "register": ":8001/register",
    "login": ":8001/login",
    'createStock': ":8005/createStock",
    'addStockToUser': ":8001/addStockToUser",
    'getStockPortfolio': ":8001/getStockPortfolio",
    'placeStockOrder': ":8003/placeStockOrder",
    'getStockPrices': ":8005/getStockPrices",
    'addMoneyToWallet': ":8001/addMoneyToWallet",
    'getWalletBalance': ":8001/getWalletBalance",
    'getWalletTransactions': ":8006/getWalletTransactions",
    'getStockTransactions': ":8006/getStockTransactions",
    'cancelStockTransaction': ":8003/cancelStockTransaction"
}


def make_post_request(endpoint, headers=None, data=None):
    try:
        url = BASE_URL + endpoint
        response = requests.post(url, headers=headers, json=data)
        #print("Response received")
        return json.loads(response.text)
    except Exception as e:
        print(e)
        return None

# Helper function to make a GET request
def make_get_request(endpoint, headers=None):
    try:
        url = BASE_URL + endpoint
        response = requests.get(url, headers=headers)
        return json.loads(response.text)
    except Exception as e:
        print(e)
        return None

def check_response_data(response, key_values, test_case, entries):
    # check for correct success value
    if response['success'] is not True:
        return False
    # check for correct number of entries in the data field
    if len(response['data']) is not entries:
        return False

    # check that the data fields are correct
    for key in key_values:
        for i in range(entries):
            if response['data'][i][key] != expected_results[test_case]['data'][i][key]:
                return False
    
    return True

def print_results(test_case, request_body, actual):
    with open("test_results.txt", "a") as file:
        file.write(generate_results_string(test_case, request_body, actual))

def generate_results_string(test_case, request_body, actual):
    title = tests[test_case-1]['title'] if test_case < 50 else tests[test_case]['title']
    return (
    f"Test Case {test_case}: {title} - {datetime.now().strftime('%H:%M:%S')}\n\n"
    f"Request body:\n{json.dumps(request_body, indent=2)}\n"
    f"Expected:\n{json.dumps(expected_results[test_case], indent=2)}\n"
    f"Actual:\n{json.dumps(actual, indent=2)}\n"
    f"{'-' * 50}\n")


totalUser1StockTransactions = 0
totalUser2StockTransactions = 0

user1token = None
user2Token = None
googleStockId = None
appleStockId = None
appleStockTxId = None

user1AppleSellTxExpire = None
user1GoogleSellTxExpire = None
user2AppleBuyTxExpire = None
user2GoogleSellTxExpire = None
user1BuyGoogleTxExpire = None


# 1. POST /register
"""
POST /register
{"user_name":"VanguardETF",
"password":"Vang@123",
"name":"Vanguard Corp."}

RESPONSE
{"success":true, "data":null}
"""
def step_1_register():
    endpoint = ENDPOINTS['register']
    data = {
        "user_name": "VanguardETF",
        "password": "Vang@123",
        "name": "Vanguard Corp."
    }
    response = make_post_request(endpoint, data=data)
    print_results(1, data, response)
    assert response == expected_results[1], f"{generate_results_string(1, data, response)}"


# 2. POST /register
"""
POST /register
{"user_name":"VanguardETF",
"password":"Vang@123",
"name":"Vanguard Corp."}

RESPONSE
{"success":false,
"data":{"error":<errorMessage>}}
"""
def step_2_register():
    endpoint = ENDPOINTS['register']
    data = {
        "user_name": "VanguardETF",
        "password": "Vang@123",
        "name": "Vanguard Corp."
    }
    response = make_post_request(endpoint, data=data)
    print_results(2, data, response)
    assert not response["success"] and response["data"]["error"], f"{generate_results_string(2, data, response)}"


# 3. POST /login
"""
POST /login
{"user_name":"VanguardETF","password":"Vang@1234"}

RESPONSE
{"success":false,"data":{"error":"<ErrorMessage>"}}
"""
def step_3_login():
    endpoint = ENDPOINTS['login']
    data = {
        "user_name": "VanguardETF",
        "password": "Vang@1234"
    }
    response = make_post_request(endpoint, data=data)
    print_results(3, data, response)
    assert not response["success"] and response["data"]["error"], f"{generate_results_string(3, data, response)}"


# 4. POST /login
"""
POST /login
{"user_name":"VanguardETF","password":"Vang@123"}

RESPONSE
{"success":true,"data":{"token":"<compToken>"}}
"""
def step_4_login():
    endpoint = ENDPOINTS['login']
    data = {
        "user_name": "VanguardETF",
        "password": "Vang@123"
    }
    response = make_post_request(endpoint, data=data)
    # print(response)
    print_results(4, data, response)
    assert response['success'], f"{generate_results_string(4, data, response)}"
    global user1token
    user1token = response['data']['token']
    assert user1token is not None, f"{generate_results_string(4, data, response)}"
    return response['data']['token']



# 5. POST /createStock
"""
POST /createStock
Header: {"token":"<compToken>"}
{"stock_name":"Google"}

RESPONSE
{"success":true,"data":{"stock_id":"<googleStockId>"}}
"""
def step_5_create_stock(comp_token):
    endpoint = ENDPOINTS['createStock']
    headers = {"token":comp_token}
    data = {
        "stock_name": "Google"
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(5, data, response)
    assert response['success'] and response['data']['stock_id'], f"{generate_results_string(5, data, response)}"
    global googleStockId
    googleStockId = response['data']['stock_id']
    assert googleStockId is not None, f"{generate_results_string(5, data, response)}"
    return response['data']['stock_id']

# 6. POST /addStockToUser
"""
POST /addStockToUser
Header: {"token":"<compToken>"}
{"stock_id":"<googleStockId>","quantity":550}

RESPONSE
{"success":true,"data":null}
"""
def step_6_add_stock_to_user(comp_token, google_stock_id):
    endpoint = ENDPOINTS['addStockToUser']
    headers = {"token":comp_token}
    data = {
        "stock_id": google_stock_id,
        "quantity": 550
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(6, data, response)
    assert response == expected_results[6], f"{generate_results_string(6, data, response)}"

# 7. POST /createStock
"""
POST /createStock
Header: {"token":"<compToken>"}
{"stock_name":"Apple"}

RESPONSE
{"success":true,"data":{"stock_id":"<appleStockId>"}}
"""
def step_7_create_stock(comp_token):
    endpoint = ENDPOINTS['createStock']
    headers = {"token":comp_token}
    data = {
        "stock_name": "Apple"
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(7, data, response)
    assert response['success'],  f"{generate_results_string(7, data, response)}"
    result = response['data']['stock_id']
    global appleStockId
    appleStockId = result
    assert result is not None, f"{generate_results_string(7, data, response)}"
    return result

# 8. POST /addStockToUser
"""
POST /addStockToUser
Header: {"token":"<compToken>"}
{"stock_id":"<appleStockId>","quantity":369}

RESPONSE
{"success":true,"data":null}
"""
def step_8_add_stock_to_user(comp_token, apple_stock_id):
    endpoint = ENDPOINTS['addStockToUser']
    headers = {"token":comp_token}
    data = {
        "stock_id": apple_stock_id,
        "quantity": 369
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(8, data, response)
    assert response == expected_results[8], f"{generate_results_string(8, data, response)}"

# 9. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":550},{"stock_id":"<appleStockId>","stock_name":"Apple","quantity_owned":369}]}
"""
def step_9_get_stock_portfolio(comp_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(9, "", response)
    assert check_response_data(response, stock_portfolio_keys, test_case=9, entries=2), f"{generate_results_string(9, "", response)}"

# 10. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<compToken>"}
{"stock_id":"<appleStockId>","is_buy":false,"order_type":"LIMIT","quantity":369,"price":140}

RESPONSE
{"success":true,"data":null}
"""
def step_10_place_stock_order(comp_token, apple_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token":comp_token}
    data = {
        "stock_id": apple_stock_id,
        "is_buy": False,
        "order_type": "LIMIT",
        "quantity": 369,
        "price": 140
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(10, data, response)
    global user1AppleSellTxExpire
    global totalUser1StockTransactions
    totalUser1StockTransactions += 1
    user1AppleSellTxExpire = datetime.now() + timedelta(minutes=1)
    assert response == expected_results[10], f"{generate_results_string(10, data, response)}"

# 11. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<compToken>"}
{"stock_id":"<googleStockId>","is_buy":false,"order_type":"LIMIT","quantity":550,"price":135}

RESPONSE
{"success":true,"data":null}
"""
def step_11_place_stock_order(comp_token, google_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token":comp_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": False,
        "order_type": "LIMIT",
        "quantity": 550,
        "price": 135
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(11, data, response)
    global user1GoogleSellTxExpire
    global totalUser1StockTransactions
    totalUser1StockTransactions += 1
    user1GoogleSellTxExpire = datetime.now() + timedelta(minutes=1)
    assert response == expected_results[11], f"{generate_results_string(11, data, response)}"


# 12. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[]}    
"""
def step_12_get_stock_portfolio(comp_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(12, None, response)
    assert response == expected_results[12], f"{generate_results_string(12, "", response)}"

# 13. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[{"stock_tx_id":"<googleCompStockTxId>","parent_stock_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":135,"quantity":550,"time_stamp":"<timestamp>"},{"stock_tx_id":"<appleCompStockTxId>","parent_stock_id":null,"stock_id":"<appleStockId>","wallet_tx_id":"<appleCompWalletTxId>","order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":140,"quantity":369,"time_stamp":"<timestamp>"}]}
"""

def step_13_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(13, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=13, entries=2), f"{generate_results_string(13, "", response)}"

# 14. POST /register
"""
POST /register
{"user_name":"FinanceGuru","password":"Fguru@2024","name":"The Finance Guru"}

RESPONSE
{"success":true,"data":null}
"""
# Step 14: POST /register
def step_14_register():
    endpoint = ENDPOINTS['register']
    data = {
        "user_name": "FinanceGuru",
        "password": "Fguru@2024",
        "name": "The Finance Guru"
    }
    response = make_post_request(endpoint, data=data)
    print_results(14, data, response)
    assert response == expected_results[14], f"{generate_results_string(14, data, response)}"

# 15. POST /login
"""
POST /login
{"user_name":"FinanceGuru","password":"Fguru@2024"}

RESPONSE
{"success":true,"data":{"token":"<user1Token>"}}
"""
def step_15_login():
    endpoint = ENDPOINTS['login']
    data = {
        "user_name": "FinanceGuru",
        "password": "Fguru@2024"
    }
    response = make_post_request(endpoint, data=data)

    print_results(15, data, response)
    assert response['success'] and response['data']['token'], f"{generate_results_string(15, data, response)}"
    global user2Token
    user2Token = response['data']['token']
    assert user2Token is not None, f"{generate_results_string(15, data, response)}"
    return response['data']['token']

# 16. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":135},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""
def step_16_get_stock_prices(user1_token):
    endpoint = ENDPOINTS['getStockPrices']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
  
    print_results(16, "", response)
    assert check_response_data(response, stock_prices_keys, test_case=16, entries=2), f"{generate_results_string(16, "", response)}"

# 17. POST /addMoneyToWallet
"""
POST /addMoneyToWallet
Header: {"token":"<user1Token>"}
{"amount":10000}

RESPONSE
{"success":true,"data":null}
"""
def step_17_add_money_to_wallet(user1_token):
    endpoint = ENDPOINTS['addMoneyToWallet']
    headers = {"token": user1_token}
    data = {"amount": 10000}
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(17, data, response)
    assert response == expected_results[17], f"{generate_results_string(17, data, response)}"

# 18. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":10000}}
"""
def step_18_get_wallet_balance(user1_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(18, "", response)
    assert response == expected_results[18], f"{generate_results_string(18, "", response)}"

# 19. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"MARKET","quantity":10,"price":null}

RESPONSE
{"success":true,"data":null}
"""
def step_19_place_stock_order(user1_token, google_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token": user1_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": True,
        "order_type": "MARKET",
        "quantity": 10,
        "price": None
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(19, data, response)
    global totalUser2StockTransactions
    totalUser2StockTransactions += 1

    assert response == expected_results[19], f"{generate_results_string(19, "", response)}"

# 20. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":135,"quantity":10,"time_stamp":"<timestamp>"}]}
"""
def step_20_get_stock_transactions(user1_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(20, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=20, entries=1), f"{generate_results_string(20, "", response)}"


# 21. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"}]}
"""
# Step 21: GET /getWalletTransactions
def step_21_get_wallet_transactions(user1_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(21, "", response)
    assert check_response_data(response, wallet_transactions_keys, test_case=21, entries=1), f"{generate_results_string(21, "", response)}"

# 22. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":8650}}
"""
def step_22_get_wallet_balance(user1_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(22, "", response)
    assert response == expected_results[22], f"{generate_results_string(22, "", response)}"

# 23. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":10}]}
"""

def step_23_get_stock_portfolio(user1_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(23, "", response)
    assert check_response_data(response, stock_portfolio_keys, test_case=23, entries=1), f"{generate_results_string(23, "", response)}"

# 24. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":null,"order_status":"PARTIAL_FULFILLED","is_buy":false,"order_type":"LIMIT","stock_price":"135","quantity":550,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<appleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<appleStockId>","wallet_tx_id":null,"order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":"140","quantity":369,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId2>","parent_stock_tx_id":"<googleCompStockTxId>","stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"COMPLETED","is_buy":false,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"}
]}
"""

def step_24_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(24, "", response)
    assert len(response['data']) == 3, f"{generate_results_string(24, "", response)}"
    #assert check_response_data(response, stock_transactions_keys, test_case=24, entries=3), f"{generate_results_string(24, "", response)}"

# 25. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":{"balance":1350}}
"""
def step_25_get_wallet_balance(comp_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(25, "", response)
    assert response == expected_results[25], f"{generate_results_string(25, "", response)}"

# 26. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[
    {"wallet_tx_id":"<googleCompWalletTxId>","stock_tx_id":"<googleCompStockTxId2>","is_debit":false,"amount":1350,"time_stamp":"<timestamp>"}
]}
"""
def step_26_get_wallet_transactions(comp_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(26, "", response)
    assert check_response_data(response, wallet_transactions_keys, test_case=26, entries=1), f"{generate_results_string(26, "", response)}"


# 27. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<appleStockId>","is_buy":true,"order_type":"LIMIT","quantity":20,"price":120}

RESPONSE
{"success":true,"data":null}
"""

def step_27_place_stock_order(user1_token, apple_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token": user1_token}
    data = {
        "stock_id": apple_stock_id,
        "is_buy": True,
        "order_type": "LIMIT",
        "quantity": 20,
        "price": 120
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(27, data, response)
    global user2AppleBuyTxExpire
    global totalUser2StockTransactions
    totalUser2StockTransactions += 1
    user2AppleBuyTxExpire = datetime.now() + timedelta(minutes=1)
    assert response == expected_results[27], f"{generate_results_string(27, data, response)}"


# 28. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<appleStockTxId>","parent_stock_tx_id":null,"stock_id":"<appleStockId>","wallet_tx_id":"<appleWalletTxId>","order_status":"IN PROGRESS","is_buy":true,"order_type":"LIMIT","stock_price":"120","quantity":20,"time_stamp":"<timestamp>"}
]}
"""
# Step 28: GET /getStockTransactions
def step_28_get_stock_transactions(user1_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(28, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=28, entries=2), f"{generate_results_string(28, "", response)}"

# 29. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[
    {"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"},
    {"wallet_tx_id":"<appleWalletTxId>","stock_tx_id":"<appleStockTxId>","is_debit":true,"amount":2400,"time_stamp":"<timestamp>"}
]}
"""
def step_29_get_wallet_transactions(user1_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(29, "", response)
    assert response['success'] and len(response['data']) == 2, f"{generate_results_string(29, "", response)}"
    # return appleStockTxId
    global appleStockTxId
    appleStockTxId = response['data'][1]['stock_tx_id']
    assert appleStockTxId is not None, f"{generate_results_string(29, "", response)}"
    return response['data'][1]['stock_tx_id']

# 30. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":6250}}
"""
def step_30_get_wallet_balance(user1_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(30, "", response)
    assert response == expected_results[30], f"{generate_results_string(30, "", response)}"

# 31. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":10}]}
"""
def step_31_get_stock_portfolio(user1_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(31, "", response)
    assert check_response_data(response, stock_portfolio_keys, test_case=31, entries=1), f"{generate_results_string(31, "", response)}"

# 32. POST /cancelStockTransaction 
"""
POST /cancelStockTransaction
Header: {"
token":"<user1Token>"}

{"stock_tx_id":"<appleStockTxId>"} 

RESPONSE
{"success":true,"data":null}
"""
def step_32_cancel_stock_transaction(user1_token, apple_stock_tx_id):
    endpoint = ENDPOINTS['cancelStockTransaction']
    headers = {"token": user1_token}
    data = {"stock_tx_id": apple_stock_tx_id}
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(32, data, response)
    global totalUser2StockTransactions
    global user2AppleBuyTxExpire
    user2AppleBuyTxExpire = None
    totalUser2StockTransactions -= 1
    print("  User 2 Apple Buy Canceled")
    assert response == expected_results[32], f"{generate_results_string(32, data, response)}"


# 33. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"}
]}
"""
# Step 33: GET /getStockTransactions
def step_33_get_stock_transactions(user1_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(33, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=33, entries=1), f"{generate_results_string(33, "", response)}"

# 34. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[
    {"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"}
]}
"""
def step_34_get_wallet_transactions(user1_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(34, "", response)
    assert check_response_data(response, wallet_transactions_keys, test_case=34, entries=1), f"{generate_results_string(34, "", response)}"

# 35. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":8650}}
"""
def step_35_get_wallet_balance(user1_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(35, "", response)
    assert response == expected_results[35], f"{generate_results_string(35, "", response)}"

# 36. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":10}]}
"""
def step_36_get_stock_portfolio(user1_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(36, "", response)
    assert check_response_data(response, stock_portfolio_keys, test_case=36, entries=1), f"{generate_results_string(36, "", response)}"

# 37. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<googleStockId>","is_buy":false,"order_type":"LIMIT","quantity":4,"price":134}

RESPONSE
{"success":true,"data":null}
"""
def step_37_place_stock_order(user1_token, google_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token": user1_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": False,
        "order_type": "LIMIT",
        "quantity": 4,
        "price": 134
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(37, "", response)
    global user2GoogleSellTxExpire
    global totalUser2StockTransactions
    totalUser2StockTransactions += 1
    user2GoogleSellTxExpire = datetime.now() + timedelta(minutes=1)
    assert response == expected_results[37], f"{generate_results_string(37, data, response)}"

# 38. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleStockTxId2>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId2>","order_status":"IN PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":"134","quantity":4,"time_stamp":"<timestamp>"}
]}
"""
def step_38_get_stock_transactions(user1_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(38, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=38, entries=2), f"{generate_results_string(38, "", response)}"


# 39. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[{"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"}]}
"""

# Step 39: GET /getWalletTransactions
def step_39_get_wallet_transactions(user1_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(39, "", response)
    assert check_response_data(response, wallet_transactions_keys, test_case=39, entries=1), f"{generate_results_string(39, "", response)}"

# 40. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":{"balance":8650}}
"""
def step_40_get_wallet_balance(user1_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(40, "", response)
    assert response == expected_results[40], f"{generate_results_string(40, "", response)}"
# 41. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":6}]}
"""
def step_41_get_stock_portfolio(user1_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(41, "", response)
    assert check_response_data(response, stock_portfolio_keys, test_case=41, entries=1), f"{generate_results_string(41, "", response)}"

# 42. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":135},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""
def step_42_get_stock_prices(comp_token):
    endpoint = ENDPOINTS['getStockPrices']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(42, "", response)
    assert check_response_data(response, stock_prices_keys, test_case=42, entries=2), f"{generate_results_string(42, "", response)}"

# 43. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<compToken>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"LIMIT","quantity":4,"price":134}

RESPONSE
{"success":true, "data":null}
"""
def step_43_place_stock_order(comp_token, google_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token":comp_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": True,
        "order_type": "LIMIT",
        "quantity": 4,
        "price": 134
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(43, data, response)
    global user1BuyGoogleTxExpire
    global totalUser1StockTransactions
    totalUser1StockTransactions += 1
    user1BuyGoogleTxExpire = datetime.now() + timedelta(minutes=1)
    assert response == expected_results[43], f"{generate_results_string(43, data, response)}"

# 44. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":null,"order_status":"PARTIAL_FULFILLED","is_buy":false,"order_type":"LIMIT","stock_price":"135","quantity":550,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<appleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<appleStockId>","wallet_tx_id":null,"order_status":"IN PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":"140","quantity":369,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId2>","parent_stock_tx_id":"<googleCompStockTxId>","stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"COMPLETED","is_buy":false,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId3>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId2>","order_status":"COMPLETED","is_buy":false,"order_type":"LIMIT","stock_price":"134","quantity":4,"time_stamp":"<timestamp>"}
]}
"""
# Step 44: GET /getStockTransactions
def step_44_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(44, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=44, entries=4), f"{generate_results_string(44, "", response)}"


############### WAIT 15 MINUTES
# time.sleep(900)

# 45. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"wallet_tx_id":"<googleCompWalletTxId>","stock_tx_id":"<googleCompStockTxId>","is_debit":false,"amount":1350,"time_stamp":"<timestamp>"},{"wallet_tx_id":"<googleCompWalletTxId2>","stock_tx_id":"<googleCompStockTxId3>","is_debit":true,"amount":536,"time_stamp":"<timestamp>"}]}
"""
# Step 45: GET /getWalletTransactions
def step_45_get_wallet_transactions(comp_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(45, "", response)
    # Check if the specific transactions are as expected
    assert check_response_data(response, wallet_transactions_keys, test_case=45, entries=2), f"{generate_results_string(45, "", response)}"

# 46. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":{"balance":8143}}
"""

def step_46_get_wallet_balance(comp_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(46, "", response)
    assert response == expected_results[46], f"{generate_results_string(46, "", response)}"


# 47. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[
    {"stock_id":"<googleStockId>","stock_name":"Google","current_price":134},
    "stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""
# Step 47: GET /getStockPrices
def step_47_get_stock_prices(comp_token):
    endpoint = ENDPOINTS['getStockPrices']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(47, "", response)
    assert response["success"]
    assert check_response_data(response, stock_prices_keys, test_case=47, entries=2), f"{generate_results_string(47, "", response)}"

# 48. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[
    {"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":135,"quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleStockTxId2>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId2>","order_status":"COMPLETED","is_buy":false,"order_type":"LIMIT","stock_price":134,"quantity":4,"time_stamp":"<timestamp>"}]}
"""

def step_48_get_stock_transactions(user1_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(48, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=48, entries=2), f"{generate_results_string(48, "", response)}"

# 49. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[
    {"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"},
    {"wallet_tx_id":"<googleWalletTxId2>","stock_tx_id":"<googleStockTxId2>","is_debit":false,"amount":536,"time_stamp":"<timestamp>"}]}
"""

def step_49_get_wallet_transactions(user1_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(49, "", response)
    assert check_response_data(response, wallet_transactions_keys, test_case=49, entries=2), f"{generate_results_string(49, "", response)}"

# 50. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":{"balance":9186}}
"""
def step_50_get_wallet_balance(user1_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(50, "", response)
    assert response == expected_results[50], f"{generate_results_string(50, "", response)}"

# 51. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[
    {"stock_tx_id":"<googleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":null,"order_status":"PARTIAL_FULFILLED","is_buy":false,"order_type":"LIMIT","stock_price":"135","quantity":550,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId2>","parent_stock_tx_id":"<googleCompStockTxId>","stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"COMPLETED","is_buy":false,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId3>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId2>","order_status":"COMPLETED","is_buy":true,"order_type":"LIMIT","stock_price":"134","quantity":4,"time_stamp":"<timestamp>"}
]}
"""
# Step 51: GET /getStockTransactions
def step_51_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(51, "", response)
    assert check_response_data(response, stock_transactions_keys, test_case=51, entries=3), f"{generate_results_string(51, "", response)}"

# 52. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[
    {"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":6},
    {"stock_id":"<appleStockId>","stock_name":"Apple","quantity_owned":369}]}
"""
def step_52_get_stock_portfolio(comp_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token":comp_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(52, "", response)
    assert check_response_data(response, stock_prices_keys, test_case=52, entries=2), f"{generate_results_string(52, "", response)}"

# 53. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<invalidToken>"}

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
def step_53_get_stock_transactions_with_invalid_token(invalid_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": invalid_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(53, "", response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(53, "", response)}"


# 54. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<invalidToken>"}

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
# Step 54: GET /getWalletTransactions with invalid token
def step_54_get_wallet_transactions_with_invalid_token(invalid_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": invalid_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(54, "", response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(54, "", response)}"

# 55. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<invalidToken>"}

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
def step_55_get_stock_transactions_with_invalid_token(invalid_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": invalid_token}
    response = make_get_request(endpoint, headers=headers)
    print_results(55, "", response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(55, "", response)}"

# 56. POST /addMoneyToWallet
"""
POST /addMoneyToWallet
Header: {"token":"<user1Token>"}
{"amount":-10000}  // Attempting to withdraw more than balance

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

def step_56_add_money_to_wallet(user1_token):
    endpoint = ENDPOINTS['addMoneyToWallet']
    headers = {"token": user1_token}
    data = {"amount": -10000}
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(56, data, response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(56, "", response)}"

# 57. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"MARKET","quantity":1,"price":80}  // Price given for Market buy

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
def step_57_place_stock_order(user1_token, google_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token": user1_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": True,
        "order_type": "MARKET",
        "quantity": 1,
        "price": 80  # Market order shouldn't have a price set
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(57, data, response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(57, "", response)}"

# 58. POST /cancelStockTransaction
"""
POST /cancelStockTransaction
Header: {"token":"<user1Token>"}
{"stock_tx_id":"<googleStockTxId2>"}  // Transaction already complete

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
def step_58_cancel_stock_transaction(user1_token, google_stock_tx_id2):
    endpoint = ENDPOINTS['cancelStockTransaction']
    headers = {"token": user1_token}
    data = {"stock_tx_id": google_stock_tx_id2}
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(58, data, response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(58, "", response)}"


# 59. POST /addMoneyToWallet
"""
POST /addMoneyToWallet
Header: {"token":"<invalidToken>"}
{"amount":-100}  // Invalid token and negative amount

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
# Step 59: POST /addMoneyToWallet with invalid token
def step_59_add_money_to_wallet_with_invalid_token(invalid_token):
    endpoint = ENDPOINTS['addMoneyToWallet']
    headers = {"token": invalid_token}
    data = {"amount": -100}  # Attempt with negative amount and invalid token
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(59, data, response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(59, "", response)}"

# 60. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<invalidToken>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"LIMIT","quantity":1,"price":80}  // Invalid token

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# Step 60: POST /placeStockOrder with invalid token
def step_60_place_stock_order_with_invalid_token(invalid_token, google_stock_id):
    endpoint = ENDPOINTS['placeStockOrder']
    headers = {"token": invalid_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": True,
        "order_type": "LIMIT",
        "quantity": 1,
        "price": 80  # Attempt with invalid token
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    print_results(60, data, response)
    assert not response['success'] and "error" in response['data'], f"{generate_results_string(60, "", response)}"

def timed_break(time_to_break):
	remaining_time = time_to_break
	while remaining_time > 0:
			print(f"############### WAIT {remaining_time // 60} MINUTES {remaining_time % 60} SECONDS")
			time.sleep(5)  # Notify every 5 seconds
			remaining_time -= 5  # Decrease remaining time by 5 seconds
            
tests = [
    {'id': 1, 'title': "Valid User 1 Register", 'test': lambda: step_1_register()},
    {'id': 2, 'title': "Invalid User 1 Register", 'test': lambda: step_2_register()},
    {'id': 3, 'title': "Invalid User 1 Login", 'test': lambda: step_3_login()},
    {'id': 4, 'title': "Valid User 1 Login", 'test': lambda: step_4_login()},
    {'id': 5, 'title': "Create Google Stock", 'test': lambda: step_5_create_stock(user1token)},
    {'id': 6, 'title': "Add google stock to first user", 'test': lambda: step_6_add_stock_to_user(user1token, googleStockId)},
    {'id': 7, 'title': "Create apple stock", 'test': lambda: step_7_create_stock(user1token)},
    {'id': 8, 'title': "Add stock to first user", 'test': lambda: step_8_add_stock_to_user(user1token, appleStockId)},
    {'id': 9, 'title': "Get User 1 stock portfolio", 'test': lambda: step_9_get_stock_portfolio(user1token)},
    {'id': 10, 'title': "User 1 Sell limit apple q: 369 p: 140", 'test': lambda: step_10_place_stock_order(user1token, appleStockId)},
    {'id': 11, 'title': "User 1 Sell limit google q: 550 p: 135", 'test': lambda: step_11_place_stock_order(user1token, googleStockId)},
    {'id': 12, 'title': "User 1 get stock portfolio", 'test': lambda: step_12_get_stock_portfolio(user1token)},
    {'id': 13, 'title': "User 1 get stock transactions", 'test': lambda: step_13_get_stock_transactions(user1token)},
		{'id': 14, 'title': "Valid register User 2", 'test': lambda: step_14_register()},
		{'id': 15, 'title': "User 2 login", 'test': lambda: step_15_login()},
		{'id': 16, 'title': "Get stock prices", 'test': lambda: step_16_get_stock_prices(user2Token)},
		{'id': 17, 'title': "User 2 add money to wallet 10 000", 'test': lambda: step_17_add_money_to_wallet(user2Token)},
		{'id': 18, 'title': "User 2 get wallet balance", 'test': lambda: step_18_get_wallet_balance(user2Token)},
		{'id': 19, 'title': "User 2 User 2 Buy market google q: 10", 'test': lambda: step_19_place_stock_order(user2Token, googleStockId)},
		{'id': 20, 'title': "User 2 get stock transactions", 'test': lambda: step_20_get_stock_transactions(user2Token)},
		{'id': 21, 'title': "User 2 get wallet transactions", 'test': lambda: step_21_get_wallet_transactions(user2Token)},
		{'id': 22, 'title': "User 2 get wallet balance", 'test': lambda: step_22_get_wallet_balance(user2Token)},
		{'id': 23, 'title': "User 2 get stock portfolio", 'test': lambda: step_23_get_stock_portfolio(user2Token)},
		{'id': 24, 'title': "User 1 get stock transactions", 'test': lambda: step_24_get_stock_transactions(user1token)},
		{'id': 25, 'title': "User 1 get wallet balance", 'test': lambda: step_25_get_wallet_balance(user1token)},
		{'id': 26, 'title': "User 1 get wallet transactions", 'test': lambda: step_26_get_wallet_transactions(user1token)},
		{'id': 27, 'title': "User 2 Buy limit apple q: 20 price: 120", 'test': lambda: step_27_place_stock_order(user2Token, appleStockId)},
		{'id': 28, 'title': "User 2 get stock transactions", 'test': lambda: step_28_get_stock_transactions(user2Token)},
		{'id': 29, 'title': "User 1 get wallet transaction", 'test': lambda: step_29_get_wallet_transactions(user2Token)},
		{'id': 30, 'title': "User 2 get wallet balance", 'test': lambda: step_30_get_wallet_balance(user2Token)},
		{'id': 31, 'title': "User 2 get stock portfolio", 'test': lambda: step_31_get_stock_portfolio(user2Token)},
		{'id': 32, 'title': "User 2 cancel apple stock transaction", 'test': lambda: step_32_cancel_stock_transaction(user2Token, appleStockTxId)},
		{'id': 33, 'title': "User 2 get stock transactions", 'test': lambda: step_33_get_stock_transactions(user2Token)},
		{'id': 34, 'title': "User 2 get wallet transactions", 'test': lambda: step_34_get_wallet_transactions(user2Token)},
		{'id': 35, 'title': "User 2 get wallet balance", 'test': lambda: step_35_get_wallet_balance(user2Token)},
		{'id': 36, 'title': "User 2 get stock portfolio", 'test': lambda: step_36_get_stock_portfolio(user2Token)},
		{'id': 37, 'title': "User 2 Sell Limit google g: 4 p: 134", 'test': lambda: step_37_place_stock_order(user2Token, googleStockId)},
		{'id': 38, 'title': "User 2 get stock transactions", 'test': lambda: step_38_get_stock_transactions(user2Token)},
		{'id': 39, 'title': "User 2 get wallet transactions", 'test': lambda: step_39_get_wallet_transactions(user2Token)},
		{'id': 40, 'title': "User 2 get wallet balance", 'test': lambda: step_40_get_wallet_balance(user2Token)},
		{'id': 41, 'title': "User 2 get stock portfolio", 'test': lambda: step_41_get_stock_portfolio(user2Token)},
		{'id': 42, 'title': "User 1 get stock prices", 'test': lambda: step_42_get_stock_prices(user1token)},
		{'id': 43, 'title': "User 1 Buy Limit google 4 134", 'test': lambda: step_43_place_stock_order(user1token, googleStockId)},
		{'id': 44, 'title': "User 1 get stock transactions", 'test': lambda: step_44_get_stock_transactions(user1token)},
		{'id': 45, 'title': "User 1 get wallet transactions", 'test': lambda: step_45_get_wallet_transactions(user1token)},
		{'id': 46, 'title': "User 1 get wallet balance", 'test': lambda: step_46_get_wallet_balance(user1token)},
		{'id': 47, 'title': "User 1 get stock prices", 'test': lambda: step_47_get_stock_prices(user1token)},
		{'id': 48, 'title': "User 2 get stock transactions", 'test': lambda: step_48_get_stock_transactions(user2Token)},
		{'id': 49, 'title': "User 2 get wallet transactions", 'test': lambda: step_49_get_wallet_transactions(user2Token)},

        {'id': '', 'title': "Minute Break", 'test': lambda: timed_break(900)}, # 15 minute break

		{'id': 50, 'title': "User 2 get wallet balance", 'test': lambda: step_50_get_wallet_balance(user2Token)},
		{'id': 51, 'title': "User 1 get stock transactions", 'test': lambda: step_51_get_stock_transactions(user1token)},
		{'id': 52, 'title': "User 1 get stock portfolio", 'test': lambda: step_52_get_stock_portfolio(user1token)},

		{'id': 53, 'title': "Invalid token get stock transactions", 'test': lambda: step_53_get_stock_transactions_with_invalid_token("<invalidToken>")},
		{'id': 54, 'title': "Invalid token get wallet transactions", 'test': lambda: step_54_get_wallet_transactions_with_invalid_token("<invalidToken>")},
		{'id': 55, 'title': "Invalid token get stock transactions", 'test': lambda: step_55_get_stock_transactions_with_invalid_token("<invalidToken>")},
		{'id': 56, 'title': "User 2 Negeitive add money error", 'test': lambda: step_56_add_money_to_wallet(user2Token)},
		{'id': 57, 'title': "User 2 price included in market order error", 'test': lambda: step_57_place_stock_order(user2Token, googleStockId)},
		{'id': 58, 'title': "Invalid token Cancel transaction", 'test': lambda: step_58_cancel_stock_transaction(user2Token, "<invalid google stock id>")},

		{'id': 59, 'title': "Invalid token add money", 'test': lambda: step_59_add_money_to_wallet_with_invalid_token("<invalidToken>")},

		{'id': 60, 'title': "Invalid token place stock order", 'test': lambda: step_60_place_stock_order_with_invalid_token("<invalidToken>", googleStockId)},
]

