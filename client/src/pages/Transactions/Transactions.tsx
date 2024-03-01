import React, { ReactElement, useEffect } from 'react';
import styles from './Transactions.module.scss';
import Layout from 'Base';
import useUsers from 'hooks/useUsers.hook';
import WalletTransactions from 'components/WalletTransactions';
import StockTransactions from 'components/StockTransactions';
function Transactions(): ReactElement {
  const { fetchWalletTransactions, walletTransactions, fetchStockTransactions, stockTransactions, cancelStockOrder } =
    useUsers();

  const localCancelTransaction = async (stockTxId: string) => {
    const success = await cancelStockOrder(stockTxId);
		console.log(success)
    if (success) {
			setTimeout(() => {
				fetchStockTransactions();
				fetchWalletTransactions();
			}, 500)
    }
  };

  useEffect(() => {
    fetchWalletTransactions();
    fetchStockTransactions();
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
