import { Tokens } from 'action/useLogin';
import { BaseApi } from 'api';
import { STORAGE_ACCESS_TOKEN } from 'lib/config';
import { LOGIN, REFRESH_TOKEN } from 'lib/routes';
import { SuccessApiResponse } from 'types/utils.types';

export const login = async (email: string, password: string): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${LOGIN}`, { email, password });
};

export const refreshToken = async (): Promise<Tokens> => {
  const authToken = localStorage.getItem(STORAGE_ACCESS_TOKEN);
  return await BaseApi.postRefresh(`${REFRESH_TOKEN}`, authToken || undefined);
};
