import { AuthorizationContext } from 'context/auth';
import { UserContext } from 'context/userProfile';
import { REFRESH_TOKEN_INTERVAL } from 'lib/config';
import { ReactElement, useCallback, useContext, useEffect, useRef } from 'react';
import useLogin from 'action/useLogin';

interface FullWrapperProps {
  children: ReactElement;
}

function FullWrapper({ children }: FullWrapperProps): ReactElement {
  return children;
}

export default FullWrapper;
