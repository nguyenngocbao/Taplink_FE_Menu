import { useRef, useState } from 'react';

import { APIStatus } from '@/types';
import { handleServerError } from '@/utils/common';

export function useDataApi<
  F extends (...args: any[]) => Promise<any>,
  Error = any
>(f: F, skipStatuses?: number[]) {
  type ResolvedType<T> = T extends Promise<infer U> ? U : T;
  type Res = ResolvedType<ReturnType<F>>;

  const [data, setData] = useState<Res | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<APIStatus>('idle');
  const [params, setParams] = useState(null);
  const callingCount = useRef(0);

  const func = async function (...rest: Parameters<F>) {
    try {
      setStatus('loading');
      setParams(rest);
      const res: Res = await f(...rest);
      setData(res);
      setError(null);
      setStatus('succeeded');
      callingCount.current++;
      return res;
    } catch (e) {
      if (skipStatuses?.includes(e.code)) {
        setData(null);
        setStatus('succeeded');
        callingCount.current++;
        return null;
      }
      setStatus('failed');
      setError(e.errors);
      handleServerError(e);
    }
  };

  return {
    call: func as F,
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
