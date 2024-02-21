import React, { ReactElement, ReactNode } from 'react';
import styles from './InfoCard.module.scss';

interface InfoCardProps {
  children: ReactNode;
  title?: string;
}

function InfoCard({ children, title }: InfoCardProps): ReactElement {
  return (
    <div className={styles.card}>
      {title && <div className={styles.title}>{title}</div>}
			<div className={styles.content}>
				{children}
			</div>
    </div>
  );
}

export default InfoCard;
