import { useContext } from 'react';
import { GlobalActionsContext } from 'context/globalActions';
import { GLOBAL_MESSAGE_TYPE } from 'types/utils.types';

interface useErrorsDetailsInfo {
  handleError: (title: string, message: string) => void;
}

function useErrors(): useErrorsDetailsInfo {
  const globalActionsContext = useContext(GlobalActionsContext);

  const handleError = (error: unknown) => {
    globalActionsContext.setGlobalMessage({
      message: 'Technical Error',
      type: GLOBAL_MESSAGE_TYPE.ERROR,
    });
  };

  return {
    handleError,
  };
}

export default useErrors;
