import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { UserContext } from 'context/userProfile';
import Button from 'components/Button';
import Layout from 'Base';
import { formatPrice } from 'lib/formatting';
import { BUTTON_TYPE } from 'components/Button/Button';
import InfoCard from 'components/InfoCard';
import useUsers from 'hooks/useUsers.hook';
import AddMoneyModal from 'components/AddMoneyModal';
import PlaceOrderModal from 'components/PlaceOrderModal';
import StockPortfolios from 'components/StockPortfolios';
import AvailableStocks from 'components/AvailableStocks';
import SellStockModal from 'components/SellStockModal';
function Home(): ReactElement {
  const [openAddMoney, setOpenAddMoney] = useState<boolean>(false);
  const [openPlaceOrder, setOpenPlaceOrder] = useState<boolean>(false);
  const [openSellStock, setOpenSellStock] = useState<boolean>(false);
  const { user } = useContext(UserContext);

  const { fetchBalance, balance, fetchStockPortfolios, stockPortfolios, fetchStocks, stocks } = useUsers();

  useEffect(() => {
    fetchBalance();
    fetchStockPortfolios();
    fetchStocks();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <InfoCard className={styles.info}>
          <div className={styles.welcome}>
            <div className={styles.greeting}>
              Welcome <span>{user?.name}</span>, Your account value is
            </div>
            <div className={styles.price}>{formatPrice(balance, true)}</div>
            <div className={styles.btns}>
              <Button
                className={styles.btn}
                style={BUTTON_TYPE.WHITE}
                label="Make a deposit"
                onClick={() => setOpenAddMoney(true)}
              />
              <Button
                className={styles.btn}
                style={BUTTON_TYPE.WHITE}
                label="Buy Stock"
                onClick={() => setOpenPlaceOrder(true)}
              />
              <Button
                className={styles.btn}
                style={BUTTON_TYPE.WHITE}
                label="Sell Stock"
                onClick={() => setOpenSellStock(true)}
              />
            </div>
          </div>
        </InfoCard>
        <div className={styles.data}>
          <StockPortfolios stockPortfolios={stockPortfolios} />
          <AvailableStocks stocks={stocks} />
        </div>
      </div>
      <AddMoneyModal
        open={openAddMoney}
        onClose={() => setOpenAddMoney(false)}
        onSave={() => {
          setOpenAddMoney(false);
          fetchBalance();
        }}
      />
      <PlaceOrderModal
        open={openPlaceOrder}
        onClose={() => setOpenPlaceOrder(false)}
        onSave={() => {
          setOpenPlaceOrder(false);
          fetchBalance();
          fetchStockPortfolios();
          fetchStocks();
        }}
      />
      <SellStockModal
        open={openSellStock}
        onClose={() => setOpenSellStock(false)}
        onSave={() => {
          setOpenSellStock(false);
          fetchBalance();
          fetchStockPortfolios();
          fetchStocks();
        }}
      />
    </Layout>
  );
}

export default Home;
