import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Wallet.module.scss';
import { UserContext } from 'context/userProfile';
import Layout from 'Base';
import useUsers from 'hooks/useUsers.hook';
import WalletTransactions from 'components/WalletTransactions';
import { formatPrice } from 'lib/formatting';
import AddMoneyModal from 'components/AddMoneyModal';
import Button from 'components/Button';
function Wallet(): ReactElement {
	const { fetchWalletTransactions, walletTransactions, fetchBalance, balance } = useUsers()
	const [openAddMoney, setOpenAddMoney] = useState<boolean>(false);


	useEffect(() => {
		fetchWalletTransactions()
		fetchBalance()
	}, [])
  return (
    <Layout >
      <div className={styles.container}>
		
					<div >
						<div className={styles.balance}>Account Balance: <span>{formatPrice(balance)}</span></div>
						<Button 
							className={styles.btn}
							label='Add Money'
							onClick={() => setOpenAddMoney(true)}
						/>
					</div>

					<WalletTransactions walletTransactions={walletTransactions}/>

		
       
      </div>
			<AddMoneyModal 
				open={openAddMoney}
				onClose={() => setOpenAddMoney(false)}
				onSave={() => {
					setOpenAddMoney(false)
					fetchBalance()
				}}
			/>
    </Layout>
  );
}

export default Wallet;
