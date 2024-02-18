import React, { ReactElement, useEffect, useState } from 'react';
import styles from './AddMoneyModal.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import TextField from 'components/TextField';
import Button from 'components/Button';
import useUsers from 'hooks/useUsers.hook';
import { BUTTON_TYPE } from 'components/Button/Button';

interface AddMoneyModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}
function AddMoneyModal({ open, onClose, onSave }: AddMoneyModalProps): ReactElement {
  const [amount, setAmount] = useState<number>();
  const [verify, setVerify] = useState<boolean>(false);

  const { addMoney } = useUsers();

  const verified = () => {
    setVerify(true);
    if (!amount || amount < 0) return false;

    return true;
  };

  const onLocalSave = async () => {
    if (!verified()) return;
    const success = await addMoney(amount!);
    if (success) {
      onSave();
    }
  };

  useEffect(() => {
    if (!open) setAmount(undefined);
  }, [open]);

  useEffect(() => {
    if (!verify) return;
    verified();
  }, [amount]);

  return (
    <>
      {open && (
        <div className={styles.background}>
          <div className={styles.container}>
            <div className={styles.title}>Add Money</div>
            <TextField
              className={styles.text}
              setValue={(value: string) => setAmount(+value)}
              value={`${amount}`}
              type="number"
              label={'Amount'}
              extraVerify={!!(amount && amount > 0)}
              verify={verify}
            />
            <div className={styles.buttons}>
              <Button className={styles.submitButton} label={'Cancel'} onClick={onClose} style={BUTTON_TYPE.OUTLINED} />
              <Button className={styles.submitButton} label={'Add'} onClick={onLocalSave} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AddMoneyModal;
