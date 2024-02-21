import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { UserContext } from 'context/userProfile';
import Button from 'components/Button';
import Layout from 'Base';
import { formatPrice } from 'lib/formatting';
import { BUTTON_TYPE } from 'components/Button/Button';
import InfoCard from 'components/InfoCard';
import WatchList from 'components/WatchList';
import Positions from 'components/Positions';
import Orders from 'components/Orders';
import useUsers from 'hooks/useUsers.hook';
import AddMoneyModal from 'components/AddMoneyModal';
import PlaceOrderModal from 'components/PlaceOrderModal';
import StockPortfolios from 'components/StockPortfolios';
function Home(): ReactElement {

	const [openAddMoney, setOpenAddMoney] = useState<boolean>(false)
  const [openPlaceOrder, setOpenPlaceOrder] = useState<boolean>(false);
  const { user } = useContext(UserContext);

	const { fetchBalance, balance, fetchStockPortfolios, stockPortfolios } = useUsers()

  useEffect(() => {
    fetchBalance()
		fetchStockPortfolios()
  }, []);

  return (
    <Layout >
      <div className={styles.container}>
        <InfoCard>
          <div className={styles.welcome}>
            <div className={styles.greeting}>
              Welcome <span>{user?.name}</span>, Your account value is
            </div>
            <div className={styles.price}>{formatPrice(balance, true)}</div>
            <Button
              className={styles.btn}
              style={BUTTON_TYPE.WHITE}
              label="Make a deposit"
              onClick={() => setOpenAddMoney(true)}
            />
						<Button className={styles.btn} style={BUTTON_TYPE.WHITE} label="Place Order" onClick={() => setOpenPlaceOrder(true)} />
          </div>
        </InfoCard>
				<StockPortfolios 
					stockPortfolios={stockPortfolios}
				/>
      </div>
			<AddMoneyModal 
				open={openAddMoney}
				onClose={() => setOpenAddMoney(false)}
				onSave={() => {
					setOpenAddMoney(false)
					fetchBalance()
				}}
			
			/>
			<PlaceOrderModal
        open={openPlaceOrder}
        onClose={() => setOpenPlaceOrder(false)}
        onSave={() => {
          setOpenPlaceOrder(false);
        }}
      />
    </Layout>
  );
}

export default Home;
