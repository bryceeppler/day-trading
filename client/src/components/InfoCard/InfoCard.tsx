import React, { ReactElement, ReactNode } from 'react';
import styles from './InfoCard.module.scss';
import classNames from 'classnames';

interface InfoCardProps {
  children: ReactNode;
  title?: string;
	className?: string;
}

function InfoCard({ children, title, className}: InfoCardProps): ReactElement {
  return (
    <div className={classNames(styles.card, className)}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export default InfoCard;
