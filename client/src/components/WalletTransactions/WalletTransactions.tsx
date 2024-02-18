import React, { ReactElement } from 'react';
import styles from './WalletTransactions.module.scss';
import InfoCard from 'components/InfoCard';
import Item from 'components/InfoCard/components/Item';
import { ORDERS } from 'lib/dummyData';
import { formatPrice } from 'lib/formatting';
import classNames from 'classnames';
import { WalletTransaction } from 'types/users.types';
import { dateFormats, formatDate } from 'lib/date';

interface WalletTransactionsProps {
  walletTransactions: Array<WalletTransaction>;
}
function WalletTransactions({ walletTransactions }: Readonly<WalletTransactionsProps>): ReactElement {
  return (
    <InfoCard title="My WalletTransactions">
      <div className={styles.info}>
        {walletTransactions.map((item) => (
          <Item key={item.wallet_tx_id}>
            <div className={styles.data}>
              <div className={styles.company}>
                <div className={styles.name}>{'Date'}</div>
                <div className={styles.value}>{formatDate(item.time_stamp, dateFormats.fullPretty)}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Type'}</div>
                <div className={styles.value}>{item.is_debit ? 'Debit' : 'Credit'}</div>
              </div>
              <div className={styles.company}>
                <div className={styles.name}>{'Amount'}</div>
                <div className={styles.value}>{formatPrice(item.amount)}</div>
              </div>
            </div>
          </Item>
        ))}
      </div>
    </InfoCard>
  );
}

export default WalletTransactions;
