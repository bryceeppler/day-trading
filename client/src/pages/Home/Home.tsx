import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Home.module.scss';
import { UserContext } from 'context/userProfile';
import Button from 'components/Button';
import Layout from 'Base';
import { formatPrice } from 'lib/formatting';
import { BUTTON_TYPE } from 'components/Button/Button';
import InfoCard from 'components/InfoCard';
import WatchList from 'components/WatchList';
import Positions from 'components/Positions';
import Orders from 'components/Orders';
function Home(): ReactElement {
  const [search, setSearch] = useState<string>('');

  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log('Fill in with Actions');
  }, [search]);
  return (
    <Layout setSearch={setSearch}>
      <div className={styles.container}>
        <InfoCard>
          <div className={styles.welcome}>
            <div className={styles.greeting}>
              Welcome <span>{user?.name}</span>, Your account value is
            </div>
            <div className={styles.price}>{formatPrice(1250.32, true)}</div>
            <Button
              className={styles.btn}
              style={BUTTON_TYPE.WHITE}
              label="Make a deposit"
              onClick={() => console.log('Make a deposit')}
            />
          </div>
        </InfoCard>
        <WatchList />
        <Positions />
        <Orders />
      </div>
    </Layout>
  );
}

export default Home;
