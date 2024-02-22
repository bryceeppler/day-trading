import jwtDecode from 'jwt-decode';
import { STORAGE_ACCESS_TOKEN } from 'lib/config';
import React, { createContext, ReactElement, ReactNode, useEffect, useState } from 'react';
import { UserLogin } from 'types/users.types';

interface UserInfo {
  user: UserLogin | undefined;
  setUser: (user: UserLogin | undefined) => void;
}

interface UserProfileProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserInfo>({
  user: undefined,
  setUser: (user: UserLogin | undefined) => null,
});

const { Provider } = UserContext;

function UserProfileProvider({ children }: UserProfileProviderProps): ReactElement {
  const [user, setUser] = useState<UserLogin | undefined>();

  useEffect(() => {
    
		localStorage.getItem(STORAGE_ACCESS_TOKEN);
		const accessToken = localStorage.getItem(STORAGE_ACCESS_TOKEN);
		if (accessToken) {
			const user: UserLogin = jwtDecode(accessToken);
			setUser(user);
		}
  }, []);

  return <Provider value={{ user, setUser }}>{children}</Provider>;
}

export { UserContext, UserProfileProvider };
