import Axios, { AxiosResponse } from 'axios';

import { COMMON_ROUTE } from '@/constants/routes';
import { ServerError } from '@/types';
import storage from '@/utils/storage';

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL
});

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error): ServerError => {
    switch (error.code) {
      case 'ERR_NETWORK':
        throw {
          message: 'Can not connect to server',
          isResolved: true
        };
      case 'ERR_BAD_RESPONSE':
        throw {
          message: 'Internal Server Error',
          isResolved: true
        };
      default:
        // TODO
        if (
          window.location.pathname !== COMMON_ROUTE.LOGIN &&
          error?.response?.status === 401
        ) {
          storage.clearToken();
          window.location.href =
            window.origin +
            '/' +
            COMMON_ROUTE.LOGIN +
            '?url=' +
            window.location.pathname +
            window.location.search;
          return error?.response?.data;
        } else {
          throw {
            message: 'Unknown error',
            errors: error?.response?.data,
            isResolved: false
          };
        }
    }
  }
);

axios.interceptors.request.use(config => {
  const token = storage.getToken();
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  config.headers.Accept = 'application/json';

  return config;
});

export default axios;
