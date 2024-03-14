import React, { ReactElement } from 'react';
import styles from './WatchList.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { WATCHLIST } from 'lib/dummyData';
import { formatPrice } from 'lib/formatting';

function WatchList(): ReactElement {
  return (
    <InfoCard title="My WatchList">
      <div className={styles.info}>
        {WATCHLIST.map((item) => (
          <Item key={item.name}>
            <div className={styles.company}>
              <div className={styles.stock}>{item.stock}</div>
              <div className={styles.name}>{item.name}</div>
            </div>
            <div className={styles.data}>
              <div className={styles.price}>{formatPrice(item.price, true)}</div>
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default WatchList;
