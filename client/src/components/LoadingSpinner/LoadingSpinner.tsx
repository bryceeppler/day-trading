import React, { ReactElement } from 'react';
import styles from './LoadingSpinner.module.scss';
import classNames from 'classnames';

interface LoadingSpinnerProps {
  loading?: boolean;
  className?: string;
}

function LoadingSpinner({ loading, className }: LoadingSpinnerProps): ReactElement {
  return loading ? (
    <div className={classNames(styles.loadingSpinner, className)}>
      <div className={styles.spinner}></div>
    </div>
  ) : (
    <></>
  );
}

export default LoadingSpinner;
