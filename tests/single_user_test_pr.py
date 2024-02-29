from test_driver import tests
from datetime import datetime
import time 

def executeTests():
     
	for i in range(49):
		print(f"{tests[i]['id']}  {tests[i]['title']}...", end="  ")	
		tests[i]['test']()
		print('PASSED')
		time.sleep(1)
		current = datetime.now()

	for i in range(54, 61):
		print(f"{tests[i]['id']}  {tests[i]['title']}...", end="  ")	
		tests[i]['test']()
		print('PASSED')
		time.sleep(1)
		current = datetime.now()
          

	print(" ------------------ All tests finished. ----------------")


def main():
    with open("test_results.txt", 'w') as file:
        file.write(f"Test Run Time: {datetime.now().strftime('%A %b %d,%Y %H:%M:%S')}\n\n")
    
    
    executeTests()

if __name__ == "__main__":
    main()
