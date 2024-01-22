export type APIStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type ServerError = {
  errors?: Record<string, Array<string>>;
  message?: string;
  isResolved?: boolean;
};

export type ServerValidationError<T> = {
  code: number;
  messages: Record<keyof T, any>;
};

export type ServerData<T> = {
  data: T;
  message: string;
  status: 'success' | 'error';
};

export type SortOrder = 'asc' | 'desc';

export type PaginationReq<T> = {
  filter?: T;
  filters?: T;
  search?: T;
  searches?: T;
  sort?: {
    field: keyof T;
    direction: SortOrder;
  };
  page?: number;
  per_page: number;
};

export type PaginationMeta = Partial<{
  current_page: number;
  prev_page: number;
  next_page: number;
  max_page: number;
  total: number;
}>;

export type PaginationRes<T> = {
  content: T[];
  pageNo?: number;
  pageSize?: number;
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
};

export type SIZE = 'lg' | 'md' | 'sm';

export interface Option {
  value: number | string | boolean;
  label: string;
}

export interface OptionRes {
  id: number;
  code: string;
  name: string;
}

export interface SkeletonProps {
  length?: number;
}

export type ROLE = 'admin' | 'store_owner' | 'unknown';

export type ComponentSet = {
  Default: (props: any) => Promise<JSX.Element>;
  Skeleton: any;
};

export interface PaginationSearchParams<Res = unknown> {
  page?: number;
  sort?: Partial<Record<keyof Res, SortOrder>>;
}
