import { BaseApi } from 'api';
import { USERS } from 'lib/routes';
import { User, CreateUser } from 'types';
import { CreateUserParams, FetchTimeCardsParams, FetchUsersParams } from 'types/users.types';
import { CreateClockInOutParams, EditTimeCardParams, SuccessApiResponse } from 'types/utils.types';

export const fetchUsers = async (params: FetchUsersParams): Promise<SuccessApiResponse> => {
  return await BaseApi.get(USERS, params);
};
export const fetchUsersStats = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${USERS}/userTypesStats`);
};
export const fetchRunningTimeCard = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${USERS}/fetchRunningTimeCard`);
};
export const fetchTimeCards = async (params: FetchTimeCardsParams): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${USERS}/fetchTimeCards`, params);
};
export const fetchUserTypes = async (): Promise<SuccessApiResponse> => {
  return await BaseApi.get(`${USERS}/userTypes`);
};
export const create = async (body: CreateUserParams): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${USERS}`, body);
};
export const clockIn = async (body: CreateClockInOutParams): Promise<SuccessApiResponse> => {
  return await BaseApi.post(`${USERS}/clockIn`, body);
};
export const clockOut = async (body: CreateClockInOutParams): Promise<SuccessApiResponse> => {
  return await BaseApi.put(`${USERS}/clockOut`, body);
};

export const editTimeCardParams = async (body: EditTimeCardParams): Promise<SuccessApiResponse> => {
  return await BaseApi.put(`${USERS}/timeCards`, body);
};

export const fetchUser = async (userId: number, date?: string): Promise<User> => {
  return await BaseApi.get(`${USERS}/${userId}`, { date });
};

export const updateUser = async (id: number, body: CreateUser): Promise<void> => {
  return await BaseApi.put(`${USERS}/${id}`, body);
};
