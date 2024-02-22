import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from 'lib/config';
import React, { createContext, ReactElement, ReactNode, useState } from 'react';

export interface AuthorizationData {
  userType: string;
  logout: () => void;
}
interface AuthorizationProps {
  children: ReactNode;
}

const defaultState = {
  userType: '',
  logout: () => null,
};

const AuthorizationContext = createContext<AuthorizationData>(defaultState);
const { Provider } = AuthorizationContext;

function AuthorizationProvider({ children }: AuthorizationProps): ReactElement {
  const [userType, setUserType] = useState<string>('');

  const logout = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN);

  };

  return <Provider value={{ userType, logout }}>{children}</Provider>;
}

export { AuthorizationContext, AuthorizationProvider };
