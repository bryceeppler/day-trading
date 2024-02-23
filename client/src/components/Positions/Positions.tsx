import React, { ReactElement } from 'react';
import styles from './Positions.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { POSITIONS } from 'lib/dummyData';
import { formatPrice } from 'lib/formatting';

function Positions(): ReactElement {
  return (
    <InfoCard title="My Positions">
      <div className={styles.info}>
        {POSITIONS.map((item) => (
          <Item key={item.name}>
            <div className={styles.company}>
              <div className={styles.stock}>{item.stock}</div>
              <div className={styles.name}>{item.name}</div>
            </div>
            <div className={styles.data}>
              <div className={styles.name}>{'P/L'}</div>
              <div className={styles.price}>{formatPrice(item.price, true)}</div>
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default Positions;
