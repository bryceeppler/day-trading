import React, { useState, useRef, useEffect, ReactElement, ReactNode } from 'react';
import styles from './Dropdown.module.scss';
import DropdownItem from '../DropdownItem';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DropdownItemProps } from '../DropdownItem/DropdownItem';
import classNames from 'classnames';

interface DropdownProps {
  className?: string;
  items: Array<DropdownItemProps>;
  value?: ReactNode;
  primary?: boolean;
  optional?: boolean;
  required?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  verify?: boolean;
  gone?: boolean;
}

function Dropdown({
  items,
  value,
  disabled,
  className,
  primary,
  optional,
  required,
  label,
  verify,
  placeholder,
  gone,
}: Readonly<DropdownProps>): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!dropdownRef.current || !divRef.current) return;

    const isButton = divRef.current.contains(event.target as Node);
    const isDropdown = dropdownRef.current.contains(event.target as Node);

    if (!isDropdown && !isButton) {
      setIsOpen(false);
    }
  };

  const onSelect = (item: DropdownItemProps) => {
    toggleDropdown();
    item.onSelect?.();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={classNames(styles.dropdown, gone && styles.gone, className)} ref={dropdownRef}>
      <label>
        {label}
        {optional && <span>{' (Optional)'}</span>}
        {primary && <span>{' (Default)'}</span>}
        {required && <span className={styles.required}>{' *'}</span>}
      </label>
      <div
        className={classNames(styles.dropdownButton, disabled && styles.disabled, verify && !value && styles.error)}
        onClick={toggleDropdown}
        ref={divRef}
      >
        {!value && <div className={styles.placeholder}>{placeholder ? placeholder : 'Select an option'}</div>}
        {value && <div className={styles.selected}>{value}</div>}
        <DownIcon className={styles.icon} />
      </div>
      {isOpen && (
        <div className={styles.dropdownMenu} style={{ minWidth: divRef.current?.offsetWidth }}>
          <ul>
            {items.map((item) => (
              <DropdownItem key={item.id} id={item.id} onSelect={() => onSelect(item)} value={item.value} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
