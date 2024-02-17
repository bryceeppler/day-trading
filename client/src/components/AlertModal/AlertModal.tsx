import React, { ReactElement } from 'react';
import styles from './AlertModal.module.scss';
import CloseIcon from '@mui/icons-material/Close'

interface AlertModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
}
function AlertModal({ open, title, message, onClose }: AlertModalProps): ReactElement {
  return (
    <>
      {open && (
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.title}>
              <label>{title}</label>
              <CloseIcon className={styles.exit} onClick={onClose} />
            </div>

            <div className={styles.titleDivider} />
            <p>{message}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default AlertModal;
