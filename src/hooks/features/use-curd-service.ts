import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useDataApi } from '@/hooks';
import { PaginationRes, PaginationSearchParams, SortOrder } from '@/types';
import { CRUDAbstract, ID } from '@/types/CRUD';
import {
  isOnServer,
  queryStringToObject,
  updateUrlWithParams
} from '@/utils/common';

interface useGetListProps<DTO extends { id: ID }, Res = unknown> {
  service: CRUDAbstract<DTO, Res>;
  limit: number;
  initialSort?: Partial<Record<keyof Res, SortOrder>>;
  useQueryParams?: boolean;
}

export const useCURDService = <
  SearchParams extends PaginationSearchParams,
  DTO extends { id: ID } = { id: ID },
  Res = unknown
>({
  service,
  limit,
  initialSort,
  useQueryParams = true
}: useGetListProps<DTO, Res>) => {
  const sp = useSearchParams();
  const initialParams = (
    isOnServer() ? {} : queryStringToObject(sp.toString())
  ) as SearchParams;

  const searchParams = useRef(
    useQueryParams
      ? {
          ...initialParams,
          page: Number(initialParams.page ?? 1),
          ...(limit && { limit }),
          ...((initialParams.sort ?? initialSort) && {
            sort: initialParams.sort ?? initialSort
          })
        }
      : {
          page: 1,
          ...(limit && { limit }),
          sort: initialSort
        }
  );

  const page = useRef(searchParams.current.page);
  const [sort, setSort] = useState<Partial<Record<keyof Res, SortOrder>>>(
    searchParams.current.sort
  );

  const { call, isLoading, data, count } = useDataApi<PaginationRes<DTO>>(
    service.list.bind(service)
  );
  const getList = call as typeof service.list;

  useEffect(() => {
    const newParams = { ...searchParams.current, limit: limit, sort: sort };
    useQueryParams && updateUrlWithParams(newParams);
    getList(newParams);
  }, [useQueryParams, sort, limit]);

  const onSearch = async (values: SearchParams) => {
    page.current = 1;

    const newParams = { ...searchParams.current, ...values, page: 1 };
    useQueryParams && updateUrlWithParams(newParams);
    getList(newParams);
    searchParams.current = newParams;
  };

  const onChangePage = (index: number) => {
    page.current = index;

    const newParams = { ...searchParams.current, page: index };
    useQueryParams && updateUrlWithParams(newParams);
    getList(newParams);
    searchParams.current = newParams;
  };

  return {
    isLoading,
    data,
    sort,
    pageIndex: Number(page.current),
    isInitialLoading: count === 0,
    searchParams: searchParams.current,
    setSort,
    getList,
    onSearch,
    onChangePage
  };
};
