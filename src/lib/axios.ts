import Axios, { AxiosResponse } from 'axios';

import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { ServerError } from '@/types';

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
          message: `Can not connect to server`,
          isResolved: true
        };
      case 'ERR_BAD_RESPONSE':
        throw {
          message: 'Internal Server Error',
          isResolved: true
        };
      default:
        if (
          window.location.pathname !== STORE_OWNER_ROUTE.LOGIN &&
          error?.response?.status === 401
        ) {
          window.location.href =
            window.origin +
            '/' +
            STORE_OWNER_ROUTE.LOGIN +
            '?callbackUrl=' +
            window.location.pathname +
            window.location.search;
          return error?.response?.data;
        } else if (error?.response?.status !== 400) {
          throw {
            message: 'Xử lý không thành công',
            isResolved: true
          };
        }
        throw {
          message: 'Unknown error',
          errors: error?.response?.data,
          isResolved: false
        };
    }
  }
);

export default axios;
