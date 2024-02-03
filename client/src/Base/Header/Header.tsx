import React, { useContext, useState } from 'react';
import styles from './Header.module.scss';
import PortfolioIcon from 'images/portfolio.svg';
import WatchListIcon from 'images/watchlist.svg';
import TransactionIcon from 'images/transactions.svg';
import { UserContext } from 'context/userProfile';
import DownIcon from 'images/downChevron.svg';
import SearchBar from 'components/SearchBar';
import useReactOperations from 'hooks/useReactOperations.hook';
import useLogin from 'action/useLogin';

interface HeaderProps {
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  signedIn?: boolean;
}
const Header = ({ signedIn, setSearch }: HeaderProps) => {
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const { user } = useContext(UserContext);
  const { navigateToLoginPage } = useReactOperations();
  const { logout } = useLogin();
  const onLogout = () => {
    logout();
    navigateToLoginPage();
  };
  return (
    <header className={styles.container}>
      <div className={styles.name}>DAY TRADING INC.</div>
      {!!user && (
        <div className={styles.signedIn}>
          <div className={styles.nav}>
            <img src={PortfolioIcon} alt="" />
            <div>Portfolio</div>
          </div>
          <div className={styles.nav}>
            <img src={WatchListIcon} alt="" />
            <div>Watchlist</div>
          </div>
          <div className={styles.nav}>
            <img src={TransactionIcon} alt="" />
            <div>Transactions</div>
          </div>
          {setSearch && (
            <SearchBar className={styles.search} onChange={setSearch} placeholder={'Search for a symbol or name'} />
          )}
        </div>
      )}
      {!!user && (
        <div className={styles.account}>
          <div>{user.fullName}</div>
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
    </header>
  );
};

export default Header;
