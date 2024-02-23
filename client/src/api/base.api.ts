import axios from 'axios';
import { STORAGE_ACCESS_TOKEN } from 'lib/config';
import { dateFormats } from 'lib/date';
import { header } from 'lib/http';
import moment from 'moment';
import { APICallError } from 'types';

const navigateToLogin = () => {
  window.location.href = '/login';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = async (route: string, params?: any, token?: string) => {
  try {
    const response = await axios.get(route, {
      params: {
        ...params,
        timeStamp: moment().format(dateFormats.sqlDateTimeFull),
      },
      headers: header(token),
    });
    return response.data;
  } catch (error) {
    const e = error as APICallError;
    if (e.response.status === 401) {
      navigateToLogin();
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    }
    throw e;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = async (route: string, body?: any, token?: string) => {
  try {
    const response = await axios.post(
      route,
      {
        ...body,
        timeStamp: moment().format(dateFormats.sqlDateTimeFull),
      },
      { headers: header(token) }
    );
    return response.data;
  } catch (error) {
    const e = error as APICallError;
    if (e.response.status === 401) {
      navigateToLogin();
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    }
    throw e;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = async (route: string, body?: any, token?: string) => {
  try {
    const response = await axios.put(
      route,
      {
        ...body,
        timeStamp: moment().format(dateFormats.sqlDateTimeFull),
      },
      { headers: header(token) }
    );
    return response.data;
  } catch (error) {
    const e = error as APICallError;
    if (e.response.status === 401) {
      navigateToLogin();
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    }
    throw e;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const del = async (route: string, body?: any, token?: string) => {
  try {
    const response = await axios.delete(route, {
      data: {
        ...body,
        timeStamp: moment().format(dateFormats.sqlDateTimeFull),
      },
      headers: header(token),
    });
    return response.data;
  } catch (error) {
    const e = error as APICallError;
    if (e.response.status === 401) {
      navigateToLogin();
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    }
    throw e;
  }
};

export const postRefresh = async (route: string, token: string | undefined) => {
  try {
    const response = await axios.post(route, { refreshToken: token }, { headers: header(token) });
    return response.data;
  } catch (error) {
    const e = error as APICallError;
    if (e.response.status === 401) {
      navigateToLogin();
      window.localStorage.removeItem(STORAGE_ACCESS_TOKEN);
    }
    throw e;
  }
};
