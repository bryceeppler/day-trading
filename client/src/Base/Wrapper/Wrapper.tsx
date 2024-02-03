import React, { FC, ReactNode } from 'react';
import styles from './Wrapper.module.scss';

interface WrapperProps {
  content: ReactNode;
}

const Wrapper: FC<WrapperProps> = ({ content }: WrapperProps) => {
  return <div className={styles.wrapper}>{content}</div>;
};

export default Wrapper;
