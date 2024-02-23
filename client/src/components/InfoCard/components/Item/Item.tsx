import React, { ReactElement, ReactNode } from 'react';
import styles from './Item.module.scss';

interface ItemProps {
  children: ReactNode;
}

function Item({ children }: ItemProps): ReactElement {
  return <div className={styles.item}>{children}</div>;
}

export default Item;
