import React, { ReactElement } from 'react';
import styles from './Presentation.module.scss';
import Header from '../Header';
import Wrapper from '../Wrapper';
import AlertModal from 'components/AlertModal';

export interface PresentationProps {
  children: React.ReactNode;
  openAlert?: boolean;

  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  alertTitle?: string;
  alertMessage?: string;
  onAlertClose?: () => void;
}

const Presentation = (props: PresentationProps): ReactElement => {
  return (
    <div className={styles.main}>
      <Header setSearch={props.setSearch} />
      <Wrapper content={props.children} />

      <AlertModal
        open={!!props.openAlert}
        title={props.alertTitle}
        message={props.alertMessage}
        onClose={props.onAlertClose}
      />
    </div>
  );
};

export default Presentation;
