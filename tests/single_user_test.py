from test_driver import tests, totalUser1StockTransactions, totalUser2StockTransactions, user1AppleSellTxExpire, user1GoogleSellTxExpire, user2AppleBuyTxExpire, user2GoogleSellTxExpire, user1BuyGoogleTxExpire 
from datetime import datetime
import time 

def executeTests():
	global totalUser1StockTransactions
	global totalUser2StockTransactions
	global user1AppleSellTxExpire
	global user1BuyGoogleTxExpire
	global user1GoogleSellTxExpire
	global user2AppleBuyTxExpire
	global user2GoogleSellTxExpire
     
	user1Transactions = 0
	user2Transactions = 0
     
	for i in range(61):
		print(f"{tests[i]['id']}  {tests[i]['title']}...", end="  ")	
		tests[i]['test']()
		print('PASSED')
		time.sleep(.5)
		current = datetime.now()


		# Tracks when a transaction has expired.  Assumes 1 minute
		if user1AppleSellTxExpire is not None and current > user1AppleSellTxExpire:
			print(f"                    User 1 Apple Sell Expired at {current.strftime('%H:%M:%S:%f')}")
			totalUser1StockTransactions -= 1
			user1AppleSellTxExpire = None
		if user1BuyGoogleTxExpire is not None and current > user1BuyGoogleTxExpire:
			print(f"                    User 1 Google Buy Expired at {current.strftime('%H:%M:%S:%f')}")
			totalUser1StockTransactions -= 1
			user1BuyGoogleTxExpire = None
		if user1GoogleSellTxExpire is not None and current > user1GoogleSellTxExpire:
			print(f"                    User 1 Google Sell Expired at {current.strftime('%H:%M:%S:%f')}")
			totalUser1StockTransactions -= 1
			user1GoogleSellTxExpire = None
		if user2AppleBuyTxExpire is not None and current > user2AppleBuyTxExpire:
			print(f"                    User 2 Apple Buy Expired at {current.strftime('%H:%M:%S:%f')}")
			totalUser2StockTransactions -= 1
			user2AppleBuyTxExpire = None
		if user2GoogleSellTxExpire is not None and current > user2GoogleSellTxExpire:
			print(f"                    User 2 Google Sell Expired at {current.strftime('%H:%M:%S:%f')}")
			totalUser2StockTransactions -= 1
			user2GoogleSellTxExpire = None

		if (user1Transactions != totalUser1StockTransactions):
			print(f"                          Total User 1 Stock Transactions: {totalUser1StockTransactions}")
			user1Transactions = totalUser1StockTransactions
		if (user2Transactions != totalUser2StockTransactions):
			print(f"                          Total User 2 Stock Transactions: {totalUser2StockTransactions}")
			user2Transactions = totalUser2StockTransactions
          

	print(" ------------------ All tests finished. ----------------")


def main():
    with open("test_results.txt", 'w') as file:
        file.write(f"Test Run Time: {datetime.now().strftime('%A %b %d,%Y %H:%M:%S')}\n\n")
    
    
    executeTests()

if __name__ == "__main__":
    main()
