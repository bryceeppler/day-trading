import React, { ReactElement } from 'react';
import styles from './StockTransactions.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { formatPrice } from 'lib/formatting';
import { StockTransaction } from 'types/users.types';
import { dateFormats, formatDate } from 'lib/date';
import Button from 'components/Button';
import { BUTTON_TYPE } from 'components/Button/Button';

interface StockTransactionsProps {
  stockTransactions: Array<StockTransaction>;
  cancelTransaction: (stockTxId: string) => void;
}
function StockTransactions({ stockTransactions, cancelTransaction }: Readonly<StockTransactionsProps>): ReactElement {
  return (
    <InfoCard title="My Stock Transactions">
      <div className={styles.info}>
        {stockTransactions.map((item) => (
          <Item key={item.stock_tx_id}>
            <div className={styles.data}>
              <div className={styles.date}>
                <div className={styles.name}>{'Date'}</div>
                <div className={styles.value}>{formatDate(item.time_stamp, dateFormats.fullPretty)}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Action'}</div>
                <div className={styles.value}>{item.is_buy ? 'Buy' : 'Sell'}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Quantity'}</div>
                <div className={styles.value}>{item.quantity}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Price'}</div>
                <div className={styles.value}>{formatPrice(item.stock_price)}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Status'}</div>
                <div className={styles.value}>{item.order_status}</div>
              </div>
              {['IN_PROGRESS', 'PARTIAL_FULFILLED'].includes(item.order_status) && (
                <div className={styles.company}>
                  <Button
                    label="Cancel"
                    style={BUTTON_TYPE.WHITE}
                    onClick={() => cancelTransaction(item.stock_tx_id)}
                  />
                </div>
              )}
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default StockTransactions;
