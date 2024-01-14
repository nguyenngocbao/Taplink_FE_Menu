import { useRef, useState } from 'react';

import { APIStatus } from '@/types';
import { handleServerError } from '@/utils/common';

export function useDataApi<Response = unknown, Error = unknown>(f: any) {
  const [data, setData] = useState<Response>(null);
  const [error, setError] = useState<Error>(null);
  const [status, setStatus] = useState<APIStatus>('idle');
  const [params, setParams] = useState(null);
  const callingCount = useRef(0);

  async function func(...rest) {
    try {
      setStatus('loading');
      setParams(rest);
      const res = await f(...rest);
      setData(res);
      setError(null);
      setStatus('succeeded');
      callingCount.current++;
      return res;
    } catch (e) {
      setStatus('failed');
      setError(e.errors);
      handleServerError(e);
    }
  }

  return {
    call: func as typeof f,
    data,
    setData,
    error,
    setError,
    status,
    count: callingCount.current,
    isLoading: status === 'loading',
    params
  };
}
