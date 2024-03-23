import React, { useContext, useState } from 'react';
import styles from './Header.module.scss';
import PortfolioIcon from 'images/portfolio.svg';
import TransactionIcon from 'images/transactions.svg';
import { UserContext } from 'context/userProfile';
import DownIcon from 'images/downChevron.svg';
import useReactOperations from 'hooks/useReactOperations.hook';
import useLogin from 'action/useLogin';
import StorageIcon from '@mui/icons-material/Storage';

const Header = () => {
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const { user } = useContext(UserContext);
  const { navigateToLoginPage, navigateToWalletPage, navigateToHomePage, navigateToSetupPage } = useReactOperations();
  const { logout } = useLogin();
  const onLogout = () => {
    logout();
    navigateToLoginPage();
  };
  return (
    <header className={styles.container}>
      <div className={styles.name} onClick={navigateToHomePage}>
        DAY TRADING INC.
      </div>
      {!!user && (
        <div className={styles.signedIn}>
          <div className={styles.nav} onClick={navigateToHomePage}>
            <img src={PortfolioIcon} alt="" />
            <div>Portfolio</div>
          </div>
          <div className={styles.nav} onClick={navigateToWalletPage}>
            <img src={TransactionIcon} alt="" />
            <div>Transactions</div>
          </div>
          {!!user && (
            <div className={styles.setup} onClick={navigateToSetupPage}>
              <StorageIcon className={styles.icon} />
              <div>Database Setup</div>
            </div>
          )}
        </div>
      )}

      <div>
        {!!user && (
          <div className={styles.account}>
            <div>{user.name}</div>
            <img src={DownIcon} alt="" onClick={() => setAccountOpen((prev) => !prev)} />
            {accountOpen && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li onClick={onLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
