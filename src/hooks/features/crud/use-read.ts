import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { useDataApi } from '@/hooks';
import { PaginationRes, PaginationSearchParams, SortOrder } from '@/types';
import { ID, useCRUDServiceProps } from '@/types/CRUD';
import {
  isOnServer,
  queryStringToObject,
  updateUrlWithParams
} from '@/utils/common';

interface useGetListProps<
  DTO extends { id?: ID } = { id?: ID },
  Modal = DTO,
  CreateReqPayload = Modal,
  UpdateReqPayload = CreateReqPayload
> extends useCRUDServiceProps<DTO, Modal, CreateReqPayload, UpdateReqPayload> {
  useQueryParams?: boolean;
  initialParams: Record<string, string> & {
    limit?: number;
    sort?: Partial<Record<keyof Modal, SortOrder>>;
  };
  enable?: boolean;
}

export const useRead = <
  SearchParams extends Modal & PaginationSearchParams,
  DTO extends { id?: ID },
  Modal = DTO,
  CreateReqPayload = Modal,
  UpdateReqPayload = CreateReqPayload
>({
  service,
  useQueryParams = true,
  initialParams,
  enable = true
}: useGetListProps<DTO, Modal, CreateReqPayload, UpdateReqPayload>) => {
  const sp = useSearchParams();
  const limit = initialParams.limit ?? 10;
  const initialQueryParams = (
    isOnServer() ? {} : queryStringToObject(sp.toString())
  ) as SearchParams;

  const searchParams = useRef(
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
  const [sort, setSort] = useState<Partial<Record<keyof Modal, SortOrder>>>(
    searchParams.current.sort
  );

  const listApi = useDataApi<PaginationRes<DTO>>(service.list.bind(service));
  const getList = listApi.call as typeof service.list;

  useEffect(() => {
    if (enable) {
      const newParams = { ...searchParams.current, limit: limit, sort: sort };
      useQueryParams && updateUrlWithParams(newParams);
      getList(newParams);
    }
  }, [useQueryParams, sort, limit, enable]);

  const onSearch = async (values?: SearchParams) => {
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
    isLoading: listApi.isLoading,
    data: listApi.data,
    setData: listApi.setData,
    sort,
    pageIndex: Number(page.current),
    isInitialLoading: listApi.count === 0,
    searchParams: searchParams.current,
    setSort,
    getList,
    onSearch,
    onChangePage
  };
};
