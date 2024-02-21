import React, { ReactElement, useEffect, useState } from 'react';
import styles from './Portfolio.module.scss';
import Layout from 'Base';
import useUsers from 'hooks/useUsers.hook';
import Button from 'components/Button';
import PlaceOrderModal from 'components/PlaceOrderModal';
import StockPortfolios from 'components/StockPortfolios';
function Portfolio(): ReactElement {
  const { fetchStockPortfolios , stockPortfolios } = useUsers();

  useEffect(() => {
    fetchStockPortfolios();
  }, []);
  return (
    <Layout>
			<div className={styles.container}>
        
      </div>

     
    </Layout>
  );
}

export default Portfolio;
