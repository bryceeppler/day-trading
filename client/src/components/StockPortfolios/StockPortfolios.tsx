import React, { ReactElement } from 'react';
import styles from './StockPortfolios.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { formatPrice } from 'lib/formatting';
import { StockPortfolio } from 'types/users.types';
import { dateFormats, formatDate } from 'lib/date';
import Button from 'components/Button';
import { BUTTON_TYPE } from 'components/Button/Button';
import useUsers from 'hooks/useUsers.hook';

interface StockPortfoliosProps {
  stockPortfolios: Array<StockPortfolio>;
}
function StockPortfolios({ stockPortfolios}: Readonly<StockPortfoliosProps>): ReactElement {
  return (
    <InfoCard title="My Stock Portfolio">
      <div className={styles.info}>
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
