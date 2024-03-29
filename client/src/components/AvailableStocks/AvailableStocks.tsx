import React, { ReactElement } from 'react';
import styles from './AvailableStocks.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { Stock } from 'types/users.types';
import { formatPrice } from 'lib/formatting';
import Button from 'components/Button';

interface AvailableStocksProps {
  stocks: Array<Stock>;
  onAddToUser?: (stockId: string) => void;
}
function AvailableStocks({ stocks, onAddToUser }: Readonly<AvailableStocksProps>): ReactElement {
  return (
    <InfoCard title="Available Stocks" className={styles.info}>
      <div>
        {stocks.map((item) => (
          <Item key={item._id}>
            <div className={styles.data}>
              <div className={styles.date}>
                <div className={styles.name}>{'Stock'}</div>
                <div className={styles.value}>{item.stock_name}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Starting Price'}</div>
                <div className={styles.value}>{formatPrice(item.starting_price, true)}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Current Price'}</div>
                <div className={styles.value}>{formatPrice(item.current_price, true)}</div>
              </div>
              {onAddToUser && <Button label="Add To User" onClick={() => onAddToUser(item._id)} />}
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default AvailableStocks;
