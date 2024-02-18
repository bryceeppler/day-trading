import { BaseApi } from 'api';
import { LOGIN, REGISTER } from 'lib/routes';
import { SuccessApiResponse } from 'types/utils.types';

export const login = async (user_name: string, password: string): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${LOGIN}`, { user_name, password });
};
export const register = async (name: string, user_name: string, password: string): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${REGISTER}`, { name, user_name, password });
};
