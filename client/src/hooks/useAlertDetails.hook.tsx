import { useEffect, useState } from 'react';

export type AlertData = {
  title: string;
  message: string;
  reset: () => void;
};

interface UseAlertDetailsInfo {
  openAlert: boolean;
  alertMessage: string | undefined;
  alertTitle: string | undefined;
  closeAlertModal: () => void;
}

interface UseAlertsProps {
  alerts: Array<AlertData>;
}

function useAlert({ alerts }: UseAlertsProps): UseAlertDetailsInfo {
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>();
  const [alertTitle, setAlertTitle] = useState<string>();

  useEffect(() => {
    if (!alerts) return;
    for (const alert of alerts) {
      if (alert.message) {
        setAlertMessage(alert.message);
        setAlertTitle(alert.title);
        setOpenAlert(true);
        break;
      }
    }
  }, [alerts]);

  const closeAlertModal = () => {
    for (const alert of alerts) {
      alert.reset();
    }
    setOpenAlert(false);
  };

  return {
    openAlert,
    alertMessage,
    alertTitle,
    closeAlertModal,
  };
}

export default useAlert;
