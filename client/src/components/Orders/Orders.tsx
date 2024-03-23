import React, { ReactElement } from 'react';
import styles from './Orders.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { ORDERS } from 'lib/dummyData';
import { formatPrice } from 'lib/formatting';
import classNames from 'classnames';

function Orders(): ReactElement {
  return (
    <InfoCard title="My Orders">
      <div className={styles.info}>
        {ORDERS.map((item) => (
          <Item key={item.name}>
            <div className={styles.company}>
              <div className={styles.stock}>{item.stock}</div>
              <div className={styles.name}>{item.name}</div>
            </div>
            <div className={styles.data}>
              <div className={classNames(styles.dataItem, styles.buySell)}>
                <div className={styles.name}>{'B/S'}</div>
                <div className={styles.value}>{item.buySell}</div>
              </div>
              <div className={classNames(styles.dataItem, styles.quantity)}>
                <div className={styles.name}>{'Quantity'}</div>
                <div className={styles.value}>{item.quantity}</div>
              </div>
              <div className={classNames(styles.dataItem, styles.type)}>
                <div className={styles.name}>{'Type'}</div>
                <div className={styles.value}>{item.type}</div>
              </div>
              <div className={classNames(styles.dataItem, styles.price)}>
                <div className={styles.name}>{'Price'}</div>
                <div className={styles.value}>{formatPrice(item.price, true)}</div>
              </div>
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default Orders;
