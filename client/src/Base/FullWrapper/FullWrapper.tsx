import { AuthorizationContext } from 'context/auth';
import { UserContext } from 'context/userProfile';
import { REFRESH_TOKEN_INTERVAL } from 'lib/config';
import { ReactElement, useCallback, useContext, useEffect, useRef } from 'react';
import useLogin from 'action/useLogin';

interface FullWrapperProps {
  children: ReactElement;
}

function FullWrapper({ children }: FullWrapperProps): ReactElement {
  const { setUserType } = useContext(AuthorizationContext);
  const { setUser } = useContext(UserContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const intervalId = useRef<any>(0);

  const { getRefreshToken } = useLogin();

  const refreshToken = useCallback(async (): Promise<void> => {
    await getRefreshToken();
  }, []);

  const refreshInterval = () => {
    intervalId.current = setInterval(async () => {
      try {
        refreshToken();
      } catch (error) {
        clearInterval(intervalId.current);
      }
    }, REFRESH_TOKEN_INTERVAL);
  };

  const initialize = useCallback(async () => {
    try {
      await refreshToken();
    } catch (error) {
      //setUserType('')
    }
  }, [setUserType, setUser]);

  useEffect(() => {
    //setUserType('');
    initialize().catch();
    refreshInterval();

    return () => clearInterval(intervalId.current);
  }, [initialize]);
  return children;
}

export default FullWrapper;
