import requests
import time 

BASE_URL = "http://localhost"


ENDPOINTS = {
    "register": "/register",
    "login": "/login",
    'createStock': "/createStock",
    'addStockToUser': "/addStockToUser",
    'getStockPortfolio': "/getStockPortfolio",
    'placeStockOrder': "/placeStockOrder",
    'getStockPrices': "/getStockPrices",
    'addMoneyToWallet': "/addMoneyToWallet",
    'getWalletBalance': "/getWalletBalance",
    'getWalletTransactions': "/getWalletTransactions",
    'getStockTransactions': "/getStockTransactions",
    'cancelStockTransaction': "/cancelStockTransaction"
}

def make_post_request(endpoint, headers=None, data=None):
    url = BASE_URL + endpoint
    response = requests.post(url, headers=headers, json=data)
    return response.json()

# Helper function to make a GET request
def make_get_request(endpoint, headers=None):
    url = BASE_URL + endpoint
    response = requests.get(url, headers=headers)
    return response.json()


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
    expected_response = {
        "success": True,
        "data": None
    }
    assert response == expected_response, f"error in step 1"


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
    expected_response = {
        "success": False,
        "data": {"error": "<ErrorMessage>"}
    }
    assert not response["success"] and response["data"]["error"], f"Error in step 2"


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
    expected_response = {
        "success": False,
        "data": {"error": "<ErrorMessage>"}
    }
    assert not response["success"] and response["data"]["error"], f"Error in step 3"


# 4. POST /login
"""
POST /login
{"user_name":"VanguardETF","password":"Vang@123"}

RESPONSE
{"success":true,"data":{"token":"<compToken>"}}
"""
def step_4_login(comp_token):
    endpoint = ENDPOINTS['login']
    data = {
        "user_name": "VanguardETF",
        "password": "Vang@123"
    }
    response = make_post_request(endpoint, data=data)
    expected_response = {
        "success": True,
        "data": {
            "token": comp_token  
        }
    }
    assert response['success'] and response['data']['token'] == comp_token, f"Error in step 4: {response}"



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
    headers = {"token": comp_token}
    data = {
        "stock_name": "Google"
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {
        "success": True,
        "data": {
            "stock_id": "<googleStockId>"  # Replace <googleStockId> with actual stock ID expected
        }
    }
    assert response['success'] and response['data']['stock_id'], f"Error in step 5: {response}"

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
    headers = {"token": comp_token}
    data = {
        "stock_id": google_stock_id,
        "quantity": 550
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {
        "success": True,
        "data": None
    }
    assert response == expected_response, f"Error in step 6: {response}"

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
    headers = {"token": comp_token}
    data = {
        "stock_name": "Apple"
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {
        "success": True,
        "data": {
            "stock_id": "<appleStockId>" 
        }
    }
    assert response['success'] and response['data']['stock_id'], f"Error in step 7: {response}"

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
    headers = {"token": comp_token}
    data = {
        "stock_id": apple_stock_id,
        "quantity": 369
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 8: {response}"

# 9. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":550},{"stock_id":"<appleStockId>","stock_name":"Apple","quantity_owned":369}]}
"""
def step_9_get_stock_portfolio(comp_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 9: {response}"

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
    headers = {"token": comp_token}
    data = {
        "stock_id": apple_stock_id,
        "is_buy": False,
        "order_type": "LIMIT",
        "quantity": 369,
        "price": 140
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 10: {response}"

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
    headers = {"token": comp_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": False,
        "order_type": "LIMIT",
        "quantity": 550,
        "price": 135
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 11: {response}"


# 12. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[]}
"""
def step_12_get_stock_portfolio(comp_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    expected_response = {"success": True, "data": []} 
    assert response == expected_response, f"Error in step 12: {response}"

# 13. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[{"stock_tx_id":"<googleCompStockTxId>","parent_stock_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":135,"quantity":550,"time_stamp":"<timestamp>"},{"stock_tx_id":"<appleCompStockTxId>","parent_stock_id":null,"stock_id":"<appleStockId>","wallet_tx_id":"<appleCompWalletTxId>","order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":140,"quantity":369,"time_stamp":"<timestamp>"}]}
"""

def step_13_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 13: {response}"

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
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 14: {response}"

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
    expected_response = {
        "success": True,
        "data": {
            "token": "<user1Token>" 
        }
    }
    assert response['success'] and response['data']['token'], f"Error in step 15: {response}"
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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 16: {response}"

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
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 17: {response}"

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
    expected_response = {"success": True, "data": {"balance": 10000}}
    assert response == expected_response, f"Error in step 18: {response}"

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
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 19: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 20: {response}"


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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 21: {response}"

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
    expected_response = {"success": True, "data": {"balance": 8650}}
    assert response == expected_response, f"Error in step 22: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 23: {response}"

# 24. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":null,"order_status":"PARTIAL_FULFILLED","is_buy":false,"order_type":"LIMIT","stock_price":"135","quantity":550,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<appleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<appleStockId>","wallet_tx_id":null,"order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":"140","quantity":369,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId2>","parent_stock_tx_id":"<googleCompStockTxId>","stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"COMPLETE","is_buy":false,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"}
]}
"""
def step_24_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 24: {response}"

# 25. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":{"balance":1350}}
"""
def step_25_get_wallet_balance(comp_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    expected_response = {"success": True, "data": {"balance": 1350}}
    assert response == expected_response, f"Error in step 25: {response}"

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
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 26: {response}"


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
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 27: {response}"


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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 28: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 29: {response}"

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
    expected_response = {"success": True, "data": {"balance": 6250}}
    assert response == expected_response, f"Error in step 30: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 31: {response}"

# 32. POST /cancelStockTransaction 
"""
POST /cancelStockTransaction
Header: {"
token":"<user1Token>"}

{"stock_tx_id":"<appleStockTxId>"} 

RESPONSE
{"success":true,
"data":[{"stock_tx_id":<googleSto
ckTxId>,
"parent_stock_tx_id":null,
"stock_id":<googleStockId>,
"wallet_tx_id":<googleWalletTxId
>, "order_status":"COMPLETED",
"is_buy":true,
"order_type":"MARKET",
"stock_price":135,"quantity":10,"ti
me_stamp":<timestamp>}]}
"""
def step_32_cancel_stock_transaction(user1_token, apple_stock_tx_id):
    endpoint = ENDPOINTS['cancelStockTransaction']
    headers = {"token": user1_token}
    data = {"stock_tx_id": apple_stock_tx_id}
    response = make_post_request(endpoint, headers=headers, data=data)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 32: {response}"


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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 33: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 34: {response}"

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
    expected_response = {"success": True, "data": {"balance": 8650}}
    assert response == expected_response, f"Error in step 35: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 36: {response}"

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
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 37: {response}"

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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 38: {response}"


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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 39: {response}"

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
    expected_response = {"success": True, "data": {"balance": 8650}}
    assert response == expected_response, f"Error in step 40: {response}"
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
    assert response['success'] and isinstance(response['data'], list), f"Error in step 41: {response}"

# 42. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":135},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""
def step_42_get_stock_prices(comp_token):
    endpoint = ENDPOINTS['getStockPrices']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 42: {response}"

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
    headers = {"token": comp_token}
    data = {
        "stock_id": google_stock_id,
        "is_buy": True,
        "order_type": "LIMIT",
        "quantity": 4,
        "price": 134
    }
    response = make_post_request(endpoint, headers=headers, data=data)
    expected_response = {"success": True, "data": None}
    assert response == expected_response, f"Error in step 43: {response}"

# 44. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[
    {"stock_tx_id":"<googleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":null,"order_status":"PARTIAL_FULFILLED","is_buy":false,"order_type":"LIMIT","stock_price":"135","quantity":550,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<appleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<appleStockId>","wallet_tx_id":null,"order_status":"IN PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":"140","quantity":369,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId2>","parent_stock_tx_id":"<googleCompStockTxId>","stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"COMPLETE","is_buy":false,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId3>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId2>","order_status":"COMPLETE","is_buy":false,"order_type":"LIMIT","stock_price":"134","quantity":4,"time_stamp":"<timestamp>"}
]}
"""
# Step 44: GET /getStockTransactions
def step_44_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 44: {response}"


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
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    # Check if the specific transactions are as expected
    assert response['success'] and isinstance(response['data'], list), f"Error in step 45: {response}"

# 46. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":{"balance":8143}}
"""

def step_46_get_wallet_balance(comp_token):
    endpoint = ENDPOINTS['getWalletBalance']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    expected_response = {"success": True, "data": {"balance": 8143}}
    assert response == expected_response, f"Error in step 46: {response}"


# 47. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":134},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""
# Step 47: GET /getStockPrices
def step_47_get_stock_prices(comp_token):
    endpoint = ENDPOINTS['getStockPrices']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 47: {response}"

# 48. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[{"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":135,"quantity":10,"time_stamp":"<timestamp>"},{"stock_tx_id":"<googleStockTxId2>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId2>","order_status":"COMPLETED","is_buy":false,"order_type":"LIMIT","stock_price":134,"quantity":4,"time_stamp":"<timestamp>"}]}
"""

def step_48_get_stock_transactions(user1_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 48: {response}"

# 49. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[{"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"},{"wallet_tx_id":"<googleWalletTxId2>","stock_tx_id":"<googleStockTxId2>","is_debit":false,"amount":536,"time_stamp":"<timestamp>"}]}
"""

def step_49_get_wallet_transactions(user1_token):
    endpoint = ENDPOINTS['getWalletTransactions']
    headers = {"token": user1_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 49: {response}"

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
    expected_response = {"success": True, "data": {"balance": 9186}}
    assert response == expected_response, f"Error in step 50: {response}"

# 51. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[
    {"stock_tx_id":"<googleCompStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":null,"order_status":"PARTIAL_FULFILLED","is_buy":false,"order_type":"LIMIT","stock_price":"135","quantity":550,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId2>","parent_stock_tx_id":"<googleCompStockTxId>","stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"COMPLETE","is_buy":false,"order_type":"MARKET","stock_price":"135","quantity":10,"time_stamp":"<timestamp>"},
    {"stock_tx_id":"<googleCompStockTxId3>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId2>","order_status":"COMPLETE","is_buy":true,"order_type":"LIMIT","stock_price":"134","quantity":4,"time_stamp":"<timestamp>"}
]}
"""
# Step 51: GET /getStockTransactions
def step_51_get_stock_transactions(comp_token):
    endpoint = ENDPOINTS['getStockTransactions']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 51: {response}"

# 52. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":6},{"stock_id":"<appleStockId>","stock_name":"Apple","quantity_owned":369}]}
"""
def step_52_get_stock_portfolio(comp_token):
    endpoint = ENDPOINTS['getStockPortfolio']
    headers = {"token": comp_token}
    response = make_get_request(endpoint, headers=headers)
    assert response['success'] and isinstance(response['data'], list), f"Error in step 52: {response}"

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
    assert not response['success'] and "error" in response['data'], f"Error in step 53: {response}"


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
    assert not response['success'] and "error" in response['data'], "Error in step 54: Expected failure due to invalid token."

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
    assert not response['success'] and "error" in response['data'], "Error in step 55: Expected failure due to invalid token."

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
    assert not response['success'] and "error" in response['data'], "Error in step 56: Attempt to withdraw more than balance should fail."

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
    assert not response['success'] and "error" in response['data'], "Error in step 57: Market buy with price should fail."

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
    assert not response['success'] and "error" in response['data'], "Error in step 58: Canceling a completed transaction should fail."


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
    assert not response['success'] and "error" in response['data'], "Error in step 59: Expected failure due to invalid token and negative amount."

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
    assert not response['success'] and "error" in response['data'], "Error in step 60: Expected failure due to invalid token."



def executeTests():
    step_1_register()
    step_2_register()
    step_3_login()
    step_4_login("<compToken>")
    step_5_create_stock("<compToken>")
    step_6_add_stock_to_user("<compToken>", "<googleStockId>")
    step_7_create_stock("<compToken>")
    step_8_add_stock_to_user("<compToken>", "<appleStockId>")
    step_9_get_stock_portfolio("<compToken>")
    step_10_place_stock_order("<compToken>", "<appleStockId>")
    step_11_place_stock_order("<compToken>", "<googleStockId>")
    step_12_get_stock_portfolio("<compToken>")
    step_13_get_stock_transactions("<compToken>")
    step_14_register()
    user1_token = step_15_login()
    step_16_get_stock_prices(user1_token)
    step_17_add_money_to_wallet(user1_token)
    step_18_get_wallet_balance(user1_token)
    step_19_place_stock_order(user1_token, "<googleStockId>")
    step_20_get_stock_transactions(user1_token)
    step_21_get_wallet_transactions(user1_token)
    step_22_get_wallet_balance(user1_token)
    step_23_get_stock_portfolio(user1_token)
    step_24_get_stock_transactions("<compToken>")
    step_25_get_wallet_balance("<compToken>")
    step_26_get_wallet_transactions("<compToken>")
    step_27_place_stock_order(user1_token, "<appleStockId>")
    step_28_get_stock_transactions(user1_token)
    step_29_get_wallet_transactions(user1_token)
    step_30_get_wallet_balance(user1_token)
    step_31_get_stock_portfolio(user1_token)
    step_32_cancel_stock_transaction(user1_token, "<appleStockTxId>")
    step_33_get_stock_transactions(user1_token)
    step_34_get_wallet_transactions(user1_token)
    step_35_get_wallet_balance(user1_token)
    step_36_get_stock_portfolio(user1_token)
    step_37_place_stock_order(user1_token, "<googleStockId>")
    step_38_get_stock_transactions(user1_token)
    step_39_get_wallet_transactions(user1_token)
    step_40_get_wallet_balance(user1_token)
    step_41_get_stock_portfolio(user1_token)
    step_42_get_stock_prices("<compToken>")
    step_43_place_stock_order("<compToken>", "<googleStockId>")
    step_44_get_stock_transactions("<compToken>")

    ############### WAIT 15 MINUTES
    time.sleep(900)
    
    step_45_get_wallet_transactions("<compToken>")
    step_46_get_wallet_balance("<compToken>")
    step_47_get_stock_prices("<compToken>")
    step_48_get_stock_transactions(user1_token)
    step_49_get_wallet_transactions(user1_token)
    step_50_get_wallet_balance(user1_token)
    step_51_get_stock_transactions("<compToken>")
    step_52_get_stock_portfolio("<compToken>")
    step_53_get_stock_transactions_with_invalid_token("<invalidToken>")
    step_54_get_wallet_transactions_with_invalid_token("<invalidToken>")
    step_55_get_stock_transactions_with_invalid_token("<invalidToken>")
    step_56_add_money_to_wallet(user1_token)
    step_57_place_stock_order(user1_token, "<googleStockId>")
    step_58_cancel_stock_transaction(user1_token, "<googleStockTxId2>")
    step_59_add_money_to_wallet_with_invalid_token("<invalidToken>")
    step_60_place_stock_order_with_invalid_token("<invalidToken>", "<googleStockId>")
    print("All tests finished.")
