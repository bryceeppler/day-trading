import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from 'lib/config';
import React, { createContext, ReactElement, ReactNode } from 'react';

export interface AuthorizationData {
  logout: () => void;
}
interface AuthorizationProps {
  children: ReactNode;
}

const defaultState = {
  logout: () => null,
};

const AuthorizationContext = createContext<AuthorizationData>(defaultState);
const { Provider } = AuthorizationContext;

function AuthorizationProvider({ children }: AuthorizationProps): ReactElement {
  const logout = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN);
  };

  return <Provider value={{ logout }}>{children}</Provider>;
}

export { AuthorizationContext, AuthorizationProvider };
