import { revalidateTag } from '@/app/actions';
import { callApi } from '@/utils/common';

import { PaginationRes } from '.';

export type ID = number | string;

export interface CRUDInterface<T> {
  prefix: string;
  isMock: boolean;
  create(item: T, revalidate?: boolean): Promise<T>;
  list(params: Record<string, string>): Promise<PaginationRes<T>>;
  get(id: ID): Promise<T | null>;
  update(newItem: T, id?: ID, revalidate?: boolean): Promise<T>;
  delete(id: ID, revalidate?: boolean): Promise<any>;
}

export abstract class CRUDAbstract<T extends { id?: ID }, R>
  implements CRUDInterface<T>
{
  prefix: string;
  isMock: boolean;

  constructor(prefix: string, isMock?: boolean) {
    this.prefix = prefix;
    this.isMock = isMock;
  }

  abstract mapDTO(res: R): T;

  async create(item: T, revalidate = true): Promise<T> {
    const res: R = await callApi(this.prefix, 'POST', item, this.isMock);
    revalidate && revalidateTag(this.prefix);
    return this.mapDTO(res);
  }

  async list(params): Promise<PaginationRes<T>> {
    const res = await callApi<PaginationRes<R>>(
      this.prefix,
      'GET',
      params,
      true
    );

    const dtos = res.data.map(this.mapDTO);
    return { ...res, data: dtos };
  }

  async get(id: ID): Promise<T | null> {
    const res: R = await callApi(
      this.prefix + '/' + id,
      'GET',
      undefined,
      this.isMock
    );
    return this.mapDTO(res);
  }

  async update(newItem: T, id: ID = newItem.id, revalidate = true): Promise<T> {
    const res: R = await callApi(
      this.prefix + '/' + id,
      'PUT',
      newItem,
      this.isMock
    );
    revalidate && revalidateTag(this.prefix);
    return this.mapDTO(res);
  }

  async delete(id: ID, revalidate = true): Promise<any> {
    const res: R = await callApi(
      this.prefix + '/' + id,
      'DELETE',
      undefined,
      this.isMock
    );
    revalidate && revalidateTag(this.prefix);
    return res;
  }
}
