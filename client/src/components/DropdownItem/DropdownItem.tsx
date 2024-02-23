import React, { ReactElement, ReactNode } from 'react';
import styles from './DropdownItem.module.scss';

export interface DropdownItemProps {
  id: number;
  value: ReactNode;
  onSelect?: () => void;
}

function DropdownItem({ id, value, onSelect }: DropdownItemProps): ReactElement {
  return (
    <li key={id} className={styles.item}>
      <div key={id} onClick={onSelect}>
        {value}
      </div>
    </li>
  );
}

export default DropdownItem;
