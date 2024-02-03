import { Stat } from './utils.types';

export type UserLogin = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
};

export type UserType = {
  id: number;
  type: string;
  description: string;
};

export type UserList = {
  id: number;
  fullName: string;
  email?: string;
  cellPhone?: string;
  homePhone?: string;
  userType: string;
};

export type UsersStat = {
  label: string;
  count: number;
};

export type TimeCard = {
  id: number;
  userId: number;
  clockIn: string;
  clockOut: string;
  lateClockInReason: string;
  lateClockOutReason: string;
};

export type FetchUsersParams = {
  searchFilter?: string;
  limit?: number;
  offset?: number;
};

export type FetchUserStatsParams = {
  total?: boolean;
  repeat?: boolean;
  repeatPercentage?: boolean;
};

export type CreateUserParams = {
  firstName: string;
  lastName: string;
  email: string;
  startDate: string;
  userTypeId: number;
  password: string;
  confirmPassword: string;

  address?: string;
  cellPhone?: string;
  homePhone?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  emergencyContactEmail?: string;
};

export type FetchTimeCardsResult = {
  results: Array<TimeCard>;
  totalResults: number;
};

export type FetchUserListResult = {
  results: Array<UserList>;
  totalResults: number;
};

export type FetchTimeCardsParams = {
  minDate: string;
  maxDate: string;
  limit?: number;
  offset?: number;
};
