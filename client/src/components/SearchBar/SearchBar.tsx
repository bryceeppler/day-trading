import React, { ChangeEvent, Dispatch, RefObject, SetStateAction } from 'react';
import styles from './SearchBar.module.scss';
import SearchIcon from '@material-ui/icons/Search';
import classNames from 'classnames';

interface SearchBarProps {
  className?: string;
  value?: string;
  onChange: Dispatch<SetStateAction<string>>;
  onSearch?: () => void;
  placeholder?: string;
  ref?: RefObject<HTMLDivElement>;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: boolean;
}

function SearchBar({
  value,
  placeholder,
  className,
  ref,
  error,
  onChange,
  onSearch,
  onFocus,
  onBlur,
}: Readonly<SearchBarProps>) {
  const localChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(value);
  };
  return (
    <div className={classNames(styles.container, className, error && styles.error)} ref={ref}>
      <SearchIcon className={styles.icon} onClick={onSearch} />
      <input
        type="text"
        value={value}
        onChange={localChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}

export default SearchBar;
