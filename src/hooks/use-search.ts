import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useDataApi } from '@/hooks';
import {
  filterEmptyParams,
  isOnServer,
  queryStringToObject,
  updateUrlWithParams
} from '@/utils/common';

interface useSearchProps<
  F extends (params: any, ...rest: any[]) => Promise<any> = any
> {
  useQueryParams?: boolean;
  initialParams?: Parameters<F>[0];
  initialRestParams?: F extends (
    params: any,
    ...rest: infer Rest
  ) => Promise<any>
    ? Rest
    : never;
  enable?: boolean;
  func: F;
}

export const useSearch = <
  F extends (params: any, ...rest: any[]) => Promise<any>
>({
  func,
  useQueryParams = true,
  initialParams,
  initialRestParams = [] as any,
  enable = true
}: useSearchProps<F>) => {
  const sp = useSearchParams();
  const pageSize = initialParams?.pageSize ?? 10;
  const initialQueryParams = isOnServer()
    ? {}
    : queryStringToObject(sp.toString());

  const searchParams = useRef<Parameters<F>[0]>(
    useQueryParams
      ? {
          ...initialQueryParams,
          pageNo: Number(initialQueryParams.pageNo ?? 0),
          ...(initialQueryParams.sort && {
            sort: initialQueryParams.sort
          }),
          ...initialParams
        }
      : {
          pageNo: 0,
          ...initialParams
        }
  );

  const pageNo = useRef(searchParams.current.pageNo);
  const [sort, setSort] = useState(searchParams.current.sort);

  const listApi = useDataApi(func);

  useEffect(() => {
    if (enable) {
      searchParams.current = { ...searchParams.current, ...initialParams };
    }
  }, [enable]);

  useEffect(() => {
    if (enable) {
      searchParams.current = { ...initialParams, ...searchParams.current };
      const newParams = { ...searchParams.current, pageSize, sort: sort };
      useQueryParams && updateUrlWithParams(newParams);
      listApi.call(newParams, initialRestParams);
    }
  }, [useQueryParams, sort, pageSize, enable]);

  const onSearch = async (
    values?: Parameters<F>[0],
    ...rest: typeof initialRestParams
  ) => {
    pageNo.current = 0;
    const newParams = {
      ...(values ? values : searchParams.current),
      pageNo: 0
    };
    useQueryParams && updateUrlWithParams(newParams);
    listApi.call(filterEmptyParams(newParams), ...(rest ?? initialRestParams));
    searchParams.current = newParams;
  };

  const onChangePage = (index: number) => {
    pageNo.current = index;

    const newParams = { ...searchParams.current, pageNo: index };
    useQueryParams && updateUrlWithParams(newParams);
    listApi.call(newParams, ...initialRestParams);
    searchParams.current = newParams;
  };

  return {
    isLoading: listApi.isLoading,
    data: listApi.data,
    setData: listApi.setData,
    sort,
    error: listApi.error,
    pageNo: Number(pageNo.current),
    isInitialLoading: listApi.count === 0,
    searchParams: searchParams.current,
    setSort,
    getList: listApi.call,
    onSearch,
    onChangePage
  };
};
