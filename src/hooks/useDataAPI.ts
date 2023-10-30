import { useCallback, useMemo, useState } from 'react';

import axios from '@/lib/axios';
import { handleServerError } from '@/utils/common';

export const useDataApi = <Response, Data = Response, Error = unknown>(
  path: string
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Data>(null);
  const [error, setError] = useState<Error>(null);

  const get = useCallback(
    async (
      params?: Record<string, unknown>,
      middleware?: (res: Response) => Data
    ): Promise<Response> => {
      try {
        setLoading(true);
        const res: Response = await axios.get(path, { params });

        if (middleware) {
          setData(middleware(res));
        } else {
          setData(res as any);
        }
        setError(null);

        return res;
      } catch (e) {
        setError(e);
        handleServerError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  const getDetail = useCallback(
    async (
      id: string | number,
      params?: Record<string, unknown>,
      middleware?: (res: Response) => Data
    ): Promise<Response> => {
      try {
        setLoading(true);
        const res: Response = await axios.get(path + '/' + id, { params });

        if (middleware) {
          setData(middleware(res));
        } else {
          setData(res as any);
        }
        setError(null);

        return res;
      } catch (e) {
        setError(e);
        handleServerError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  const post = useCallback(
    async (data?: any, middleware?: (res: Response) => Data) => {
      try {
        setLoading(true);
        const res: Response = await axios.post(path, data);

        if (middleware) {
          setData(middleware(res));
        } else {
          setData(res as any);
        }
        setLoading(false);
        setError(null);

        return res;
      } catch (e) {
        setError(e);
        handleServerError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  const put = useCallback(
    async (data?: any, middleware?: (res: Response) => Data) => {
      try {
        setLoading(true);
        const res: Response = await axios.put(path, data);

        if (middleware) {
          setData(middleware(res));
        } else {
          setData(res as any);
        }
        setLoading(false);
        setError(null);

        return res;
      } catch (e) {
        setError(e);
        handleServerError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  const patch = useCallback(
    async (
      data?: Record<string, unknown>,
      middleware?: (res: Response) => Data
    ) => {
      try {
        setLoading(true);
        const res: Response = await axios.patch(path, data);

        if (middleware) {
          setData(middleware(res));
        } else {
          setData(res as any);
        }
        setError(null);

        return res;
      } catch (e) {
        setError(e);
        handleServerError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [path]
  );

  return useMemo(
    () => ({
      loading,
      data,
      get,
      patch,
      post,
      put,
      getDetail,
      setData,
      error,
      setError
    }),
    [loading, data, get, patch, post, put, getDetail, setData, error, setError]
  );
};
