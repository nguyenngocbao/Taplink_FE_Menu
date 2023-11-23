export type APIStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type ServerError = {
  errors?: Record<string, Array<string>>;
  message?: string;
  isResolved?: boolean;
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
  from: number;
  last_page: number;
  links: [
    {
      url: null;
      label: string;
      active: false;
    }
  ];
  path: string;
  per_page: number;
  to: number;
  total: number;
}>;

export type PaginationRes<T> = Partial<{
  links: {
    first: string;
    last: string;
    prev: null;
    next: string;
  };
  meta: PaginationMeta;
}> &
  T;

export type SIZE = 'lg' | 'md' | 'sm';

export interface Option {
  value: number | string;
  label: string;
}

export interface SkeletonProps {
  length?: number;
}
