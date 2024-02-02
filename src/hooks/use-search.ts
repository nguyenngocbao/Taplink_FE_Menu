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
  const limit = initialParams?.limit ?? 10;
  const initialQueryParams = isOnServer()
    ? {}
    : queryStringToObject(sp.toString());

  const searchParams = useRef<Parameters<F>[0]>(
    useQueryParams
      ? {
          ...initialQueryParams,
          page: Number(initialQueryParams.page ?? 1),
          ...(initialQueryParams.sort && {
            sort: initialQueryParams.sort
          }),
          ...initialParams
        }
      : {
          page: 1,
          ...initialParams
        }
  );

  const page = useRef(searchParams.current.page);
  const [sort, setSort] = useState(searchParams.current.sort);

  const listApi = useDataApi(func);

  useEffect(() => {
    if (enable) {
      const newParams = { ...searchParams.current, limit: limit, sort: sort };
      useQueryParams && updateUrlWithParams(newParams);
      listApi.call(newParams, initialRestParams);
    }
  }, [useQueryParams, sort, limit, enable]);

  const onSearch = async (
    values?: Parameters<F>[0],
    ...rest: typeof initialRestParams
  ) => {
    page.current = 1;
    const newParams = { ...(values ? values : searchParams.current), page: 1 };
    useQueryParams && updateUrlWithParams(newParams);
    listApi.call(filterEmptyParams(newParams), ...(rest ?? initialRestParams));
    searchParams.current = newParams;
  };

  const onChangePage = (index: number) => {
    page.current = index;

    const newParams = { ...searchParams.current, page: index };
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
    pageIndex: Number(page.current),
    isInitialLoading: listApi.count === 0,
    searchParams: searchParams.current,
    setSort,
    getList: listApi.call,
    onSearch,
    onChangePage
  };
};
