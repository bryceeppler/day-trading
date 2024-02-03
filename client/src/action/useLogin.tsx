import { LoginApi } from 'api';
import { UsersApi } from 'api';
import { UserContext } from 'context/userProfile';
import jwtDecode from 'jwt-decode';
import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN, STORAGE_USER } from 'lib/config';
import { useContext } from 'react';
import { User } from 'types';
import { UserLogin } from 'types/users.types';
import useErrors from 'hooks/useErrors.hook';
import { handleApiError } from 'lib/errors';

export interface Tokens {
  auth: string;
  refresh: string;
}
function useLogin() {
  const { handleError } = useErrors();
  const userContext = useContext(UserContext);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      /*
      const response = await LoginApi.login(username, password);
      const accessTokens = response.data as Tokens;
      localStorage.setItem(STORAGE_ACCESS_TOKEN, accessTokens.auth);
      localStorage.setItem(STORAGE_REFRESH_TOKEN, accessTokens.refresh)
			*/
      const user: UserLogin = {
        //jwtDecode(accessTokens.auth);
        id: 2,
        fullName: 'Matthew Buie',
        firstName: 'Matt',
        lastName: 'Buie',
      };
      userContext.setUser(user);
    } catch (error) {
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      window.localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      window.localStorage.removeItem(STORAGE_USER);
      handleError('Error', handleApiError(error));
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    userContext.setUser(undefined);
  };

  const fetchUser = async (id: number, date?: string): Promise<User> => {
    return await UsersApi.fetchUser(id, date);
  };

  const getRefreshToken = async (): Promise<void> => {
    const accessTokens = await LoginApi.refreshToken();
    localStorage.setItem(STORAGE_ACCESS_TOKEN, accessTokens.auth);
    localStorage.setItem(STORAGE_REFRESH_TOKEN, accessTokens.refresh);
    const user: UserLogin = jwtDecode(accessTokens.auth);
    userContext.setUser(user);
  };

  return {
    login,
    logout,
    fetchUser,
    getRefreshToken,
  };
}

export default useLogin;
