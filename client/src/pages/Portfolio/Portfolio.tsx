import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Portfolio.module.scss';
import Layout from 'Base';
import useUsers from 'hooks/useUsers.hook';
import AddMoneyModal from 'components/AddMoneyModal';
import Button from 'components/Button';
import PlaceOrderModal from 'components/PlaceOrderModal';
function Portfolio(): ReactElement {
  const { fetchStockPortfolios, stockPortfolios } = useUsers();
  const [openPlaceOrder, setOpenPlaceOrder] = useState<boolean>(false);

  useEffect(() => {
    fetchStockPortfolios();
  }, []);
  return (
    <Layout>
      <div className={styles.container}>
        <Button className={styles.btn} label="Add Money" onClick={() => setOpenPlaceOrder(true)} />
      </div>
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

export default Portfolio;
