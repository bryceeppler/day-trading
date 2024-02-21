import React, { ReactElement, useEffect, useState } from 'react';
import styles from './Transactions.module.scss';
import Layout from 'Base';
import useUsers from 'hooks/useUsers.hook';
import WalletTransactions from 'components/WalletTransactions';
import { formatPrice } from 'lib/formatting';
import AddMoneyModal from 'components/AddMoneyModal';
import Button from 'components/Button';
import StockTransactions from 'components/StockTransactions';
function Transactions(): ReactElement {
  const { fetchWalletTransactions, walletTransactions, fetchStockTransactions, stockTransactions, cancelStockOrder} = useUsers();
  const [openAddMoney, setOpenAddMoney] = useState<boolean>(false);

	const localCancelTransaction = async (stockTxId: string) => {
		const success = await cancelStockOrder(stockTxId);
		if (success) {
			fetchStockTransactions()
		}
	}

  useEffect(() => {
    fetchWalletTransactions();
		fetchStockTransactions()
  }, []);
  return (
    <Layout>
      <div className={styles.container}>
        <WalletTransactions walletTransactions={walletTransactions} />
				<StockTransactions stockTransactions={stockTransactions} cancelTransaction={localCancelTransaction} />
      </div>
    </Layout>
  );
}

export default Transactions;
