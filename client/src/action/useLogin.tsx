import { LoginApi } from 'api';
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
  const userContext = useContext(UserContext);

  const login = async (username: string, password: string): Promise<void | string> => {
    try {
      const response = await LoginApi.login(username, password);
      if (!response.success) {
        userContext.setUser(undefined);
        return response.data.message;
      }
      const accessToken = response.data.token;
      localStorage.setItem(STORAGE_ACCESS_TOKEN, accessToken);

      const user: UserLogin = jwtDecode(accessToken);
      userContext.setUser(user);
    } catch (error) {
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      window.localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      window.localStorage.removeItem(STORAGE_USER);
      return handleApiError(error);
    }
  };

  const register = async (name: string, username: string, password: string): Promise<void | string> => {
    try {
      const response = await LoginApi.register(name, username, password);
      console.log(response);
      if (!response.success) {
        userContext.setUser(undefined);
        return response.data.message;
      }
    } catch (error) {
      console.log(error);
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      window.localStorage.removeItem(STORAGE_REFRESH_TOKEN);
      window.localStorage.removeItem(STORAGE_USER);
      return handleApiError(error);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_USER);
    userContext.setUser(undefined);
  };

  return {
    login,
    logout,
    register,
  };
}

export default useLogin;
