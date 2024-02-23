import { LoginApi } from 'api';
import { UserContext } from 'context/userProfile';
import jwtDecode from 'jwt-decode';
import { STORAGE_ACCESS_TOKEN } from 'lib/config';
import { useContext } from 'react';
import { UserLogin } from 'types/users.types';
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
        return response.data.error;
      }
      const accessToken = response.data.token;
      localStorage.setItem(STORAGE_ACCESS_TOKEN, accessToken);

      const user: UserLogin = jwtDecode(accessToken);
      userContext.setUser(user);
    } catch (error) {
      console.log(error);
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      return handleApiError(error);
    }
  };

  const register = async (name: string, username: string, password: string): Promise<void | string> => {
    try {
      const response = await LoginApi.register(name, username, password);
      if (!response.success) {
        userContext.setUser(undefined);
        return response.data.error;
      }
    } catch (error) {
      console.log(error);
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
      return handleApiError(error);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    userContext.setUser(undefined);
  };

  return {
    login,
    logout,
    register,
  };
}

export default useLogin;
