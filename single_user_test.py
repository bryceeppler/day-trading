import requests
import time 

BASE_URL = "http://localhost"



# 1. POST /register
"""
POST /register
{"user_name":"VanguardETF",
"password":"Vang@123",
"name":"Vanguard Corp."}

RESPONSE
{"success":true, "data":null}
"""



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

# 3. POST /login
"""
POST /login
{"user_name":"VanguardETF","password":"Vang@1234"}

RESPONSE
{"success":false,"data":{"error":"<ErrorMessage>"}}
"""

# 4. POST /login
"""
POST /login
{"user_name":"VanguardETF","password":"Vang@123"}

RESPONSE
{"success":true,"data":{"token":"<compToken>"}}
"""

# 5. POST /createStock
"""
POST /createStock
Header: {"token":"<compToken>"}
{"stock_name":"Google"}

RESPONSE
{"success":true,"data":{"stock_id":"<googleStockId>"}}
"""

# 6. POST /addStockToUser
"""
POST /addStockToUser
Header: {"token":"<compToken>"}
{"stock_id":"<googleStockId>","quantity":550}

RESPONSE
{"success":true,"data":null}
"""

# 7. POST /createStock
"""
POST /createStock
Header: {"token":"<compToken>"}
{"stock_name":"Apple"}

RESPONSE
{"success":true,"data":{"stock_id":"<appleStockId>"}}
"""

# 8. POST /addStockToUser
"""
POST /addStockToUser
Header: {"token":"<compToken>"}
{"stock_id":"<appleStockId>","quantity":369}

RESPONSE
{"success":true,"data":null}
"""

# 9. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":550},{"stock_id":"<appleStockId>","stock_name":"Apple","quantity_owned":369}]}
"""

# 10. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<compToken>"}
{"stock_id":"<appleStockId>","is_buy":false,"order_type":"LIMIT","quantity":369,"price":140}

RESPONSE
{"success":true,"data":null}
"""

# 11. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<compToken>"}
{"stock_id":"<googleStockId>","is_buy":false,"order_type":"LIMIT","quantity":550,"price":135}

RESPONSE
{"success":true,"data":null}
"""

# 12. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[]}
"""

# 13. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[{"stock_tx_id":"<googleCompStockTxId>","parent_stock_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleCompWalletTxId>","order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":135,"quantity":550,"time_stamp":"<timestamp>"},{"stock_tx_id":"<appleCompStockTxId>","parent_stock_id":null,"stock_id":"<appleStockId>","wallet_tx_id":"<appleCompWalletTxId>","order_status":"IN_PROGRESS","is_buy":false,"order_type":"LIMIT","stock_price":140,"quantity":369,"time_stamp":"<timestamp>"}]}
"""

# 14. POST /register
"""
POST /register
{"user_name":"FinanceGuru","password":"Fguru@2024","name":"The Finance Guru"}

RESPONSE
{"success":true,"data":null}
"""

# 15. POST /login
"""
POST /login
{"user_name":"FinanceGuru","password":"Fguru@2024"}

RESPONSE
{"success":true,"data":{"token":"<user1Token>"}}
"""

# 16. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":135},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""

# 17. POST /addMoneyToWallet
"""
POST /addMoneyToWallet
Header: {"token":"<user1Token>"}
{"amount":10000}

RESPONSE
{"success":true,"data":null}
"""

# 18. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":10000}}
"""

# 19. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"MARKET","quantity":10,"price":null}

RESPONSE
{"success":true,"data":null}
"""

# 20. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":135,"quantity":10,"time_stamp":"<timestamp>"}]}
"""

# 21. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"}]}
"""


# 22. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":8650}}
"""

# 23. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":10}]}
"""

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

# 25. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":{"balance":1350}}
"""

# 26. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true,"data":[
    {"wallet_tx_id":"<googleCompWalletTxId>","stock_tx_id":"<googleCompStockTxId2>","is_debit":false,"amount":1350,"time_stamp":"<timestamp>"}
]}
"""

# 27. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<appleStockId>","is_buy":true,"order_type":"LIMIT","quantity":20,"price":120}

RESPONSE
{"success":true,"data":null}
"""

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

# 30. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":{"balance":6250}}
"""

# 31. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":10}]}
"""

# 39. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[{"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"}]}
"""

# 40. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":{"balance":8650}}
"""

# 41. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true,"data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":6}]}
"""

# 42. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":135},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""

# 43. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<compToken>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"LIMIT","quantity":4,"price":134}

RESPONSE
{"success":true, "data":null}
"""

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


############### WAIT 15 MINUTES
time.sleep(900)


# 45. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"wallet_tx_id":"<googleCompWalletTxId>","stock_tx_id":"<googleCompStockTxId>","is_debit":false,"amount":1350,"time_stamp":"<timestamp>"},{"wallet_tx_id":"<googleCompWalletTxId2>","stock_tx_id":"<googleCompStockTxId3>","is_debit":true,"amount":536,"time_stamp":"<timestamp>"}]}
"""

# 46. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":{"balance":8143}}
"""

# 47. GET /getStockPrices
"""
GET /getStockPrices
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","current_price":134},{"stock_id":"<appleStockId>","stock_name":"Apple","current_price":140}]}
"""

# 48. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[{"stock_tx_id":"<googleStockTxId>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId>","order_status":"COMPLETED","is_buy":true,"order_type":"MARKET","stock_price":135,"quantity":10,"time_stamp":"<timestamp>"},{"stock_tx_id":"<googleStockTxId2>","parent_stock_tx_id":null,"stock_id":"<googleStockId>","wallet_tx_id":"<googleWalletTxId2>","order_status":"COMPLETED","is_buy":false,"order_type":"LIMIT","stock_price":134,"quantity":4,"time_stamp":"<timestamp>"}]}
"""

# 49. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":[{"wallet_tx_id":"<googleWalletTxId>","stock_tx_id":"<googleStockTxId>","is_debit":true,"amount":1350,"time_stamp":"<timestamp>"},{"wallet_tx_id":"<googleWalletTxId2>","stock_tx_id":"<googleStockTxId2>","is_debit":false,"amount":536,"time_stamp":"<timestamp>"}]}
"""

# 50. GET /getWalletBalance
"""
GET /getWalletBalance
Header: {"token":"<user1Token>"}

RESPONSE
{"success":true, "data":{"balance":9186}}
"""

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

# 52. GET /getStockPortfolio
"""
GET /getStockPortfolio
Header: {"token":"<compToken>"}

RESPONSE
{"success":true, "data":[{"stock_id":"<googleStockId>","stock_name":"Google","quantity_owned":6},{"stock_id":"<appleStockId>","stock_name":"Apple","quantity_owned":369}]}
"""

# 53. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<invalidToken>"}

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# 54. GET /getWalletTransactions
"""
GET /getWalletTransactions
Header: {"token":"<invalidToken>"}

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# 55. GET /getStockTransactions
"""
GET /getStockTransactions
Header: {"token":"<invalidToken>"}

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
# 56. POST /addMoneyToWallet
"""
POST /addMoneyToWallet
Header: {"token":"<user1Token>"}
{"amount":-10000}  // Attempting to withdraw more than balance

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# 57. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<user1Token>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"MARKET","quantity":1,"price":80}  // Price given for Market buy

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# 58. POST /cancelStockTransaction
"""
POST /cancelStockTransaction
Header: {"token":"<user1Token>"}
{"stock_tx_id":"<googleStockTxId2>"}  // Transaction already complete

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# 59. POST /addMoneyToWallet
"""
POST /addMoneyToWallet
Header: {"token":"<invalidToken>"}
{"amount":-100}  // Invalid token and negative amount

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""

# 60. POST /placeStockOrder
"""
POST /placeStockOrder
Header: {"token":"<invalidToken>"}
{"stock_id":"<googleStockId>","is_buy":true,"order_type":"LIMIT","quantity":1,"price":80}  // Invalid token

RESPONSE
{"success":false, "data":{"error":"<ErrorMessage>"}}
"""
