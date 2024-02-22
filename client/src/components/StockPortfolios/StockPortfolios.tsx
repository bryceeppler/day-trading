import React, { ReactElement } from 'react';
import styles from './StockPortfolios.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { StockPortfolio } from 'types/users.types';

interface StockPortfoliosProps {
  stockPortfolios: Array<StockPortfolio>;
}
function StockPortfolios({ stockPortfolios }: Readonly<StockPortfoliosProps>): ReactElement {
  return (
    <InfoCard title="My Stock Portfolio" className={styles.info}>
      <div >
        {stockPortfolios.map((item) => (
          <Item key={item.stock_id}>
            <div className={styles.data}>
              <div className={styles.date}>
                <div className={styles.name}>{'Stock'}</div>
                <div className={styles.value}>{item.stock_name}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Quantity Owned'}</div>
                <div className={styles.value}>{item.quantity_owned}</div>
              </div>
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default StockPortfolios;
