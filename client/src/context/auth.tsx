import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from 'lib/config';
import React, { createContext, ReactElement, ReactNode, useState, useEffect } from 'react';
import { refresh } from 'action/refreshToken';

export interface AuthorizationData {
  userType: string;
  setUserType: (usertype: string) => void;
  logout: () => void;
}
interface AuthorizationProps {
  children: ReactNode;
}

const defaultState = {
  userType: '',
  setUserType: (usertype: string) => null,
  logout: () => null,
};

const AuthorizationContext = createContext<AuthorizationData>(defaultState);
const { Provider } = AuthorizationContext;

function AuthorizationProvider({ children }: AuthorizationProps): ReactElement {
  const [userType, setUserType] = useState<string>('');

  // refresh jwt
  useEffect(() => {
    const intervalID = setInterval(() => refresh(), 15 * 60 * 1000); // 15mins * 1000ms

    return () => clearInterval(intervalID);
  }, []);

  const logout = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    setUserType('');
  };

  return <Provider value={{ userType, setUserType, logout }}>{children}</Provider>;
}

export { AuthorizationContext, AuthorizationProvider };
