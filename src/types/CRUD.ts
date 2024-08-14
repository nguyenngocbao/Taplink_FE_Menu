import { revalidateTag } from '@/app/actions';
import { bindMethodsToSelf, callApi } from '@/utils/common';

import { PaginationRes, SearchParams } from '.';

export interface useCRUDServiceProps<
  DTO extends { id?: ID },
  Modal extends { id: ID },
  CreateReqPayload = Modal & { id?: ID },
  UpdateReqPayload = Modal & { id?: ID }
> {
  service: CRUDAbstract<DTO, Modal, CreateReqPayload, UpdateReqPayload>;
}

export type ID = number | string;

export interface CRUDInterface<DTO, Modal, CreateReqPayload, UpdateReqPayload> {
  prefix: string;
  isMock: boolean;
  create(
    item: CreateReqPayload,
    revalidate?: boolean,
    headers?: Record<string, string>
  ): Promise<DTO>;
  list(
    params: SearchParams<Modal, Record<string, unknown>>
  ): Promise<PaginationRes<DTO>>;
  get(id: ID): Promise<DTO | null>;
  update(
    newItem: UpdateReqPayload,
    id: ID,
    revalidate?: boolean,
    headers?: Record<string, string>
  ): Promise<DTO>;
  delete(id: ID, revalidate?: boolean): Promise<any>;
}

export abstract class CRUDAbstract<
  DTO extends { id?: ID },
  Modal extends { id: ID },
  CreateReqPayload = Modal & { id?: ID },
  UpdateReqPayload = Modal & { id?: ID }
> implements CRUDInterface<DTO, Modal, CreateReqPayload, UpdateReqPayload>
{
  prefix: string;
  private revalidateTags: {
    create: string[];
    update: string[];
    delete: string[];
  };
  isMock: boolean;
  isAutoNo: boolean;

  constructor(prefix: string, isMock?: boolean, isAutoNo?: boolean) {
    this.prefix = prefix;
    this.isMock = isMock;
    this.isAutoNo = isAutoNo ?? true;
    this.revalidateTags = {
      create: [this.prefix],
      update: [this.prefix],
      delete: [this.prefix]
    };
    bindMethodsToSelf(CRUDAbstract, this);
  }

  addRevalidateTags(tags: string[], type?: 'create' | 'update' | 'delete') {
    switch (type) {
      case 'create':
        this.revalidateTags.create.push(...tags);
        break;
      case 'update':
        this.revalidateTags.update.push(...tags);
        break;
      case 'delete':
        this.revalidateTags.delete.push(...tags);
        break;
      default:
        this.revalidateTags.create.push(...tags);
        this.revalidateTags.update.push(...tags);
        this.revalidateTags.delete.push(...tags);
        break;
    }
  }

  removeRevalidateTags(tags: string[], type: 'create' | 'update' | 'delete') {
    switch (type) {
      case 'create':
        this.revalidateTags.create = this.revalidateTags.create.filter(
          t => !tags.includes(t)
        );
        break;
      case 'update':
        this.revalidateTags.update = this.revalidateTags.update.filter(
          t => !tags.includes(t)
        );
        break;
      case 'delete':
        this.revalidateTags.delete = this.revalidateTags.delete.filter(
          t => !tags.includes(t)
        );
        break;
      default:
        this.revalidateTags.create = this.revalidateTags.create.filter(
          t => !tags.includes(t)
        );
        this.revalidateTags.update = this.revalidateTags.update.filter(
          t => !tags.includes(t)
        );
        this.revalidateTags.delete = this.revalidateTags.delete.filter(
          t => !tags.includes(t)
        );
        break;
    }
  }

  abstract mapDTO(res: Modal): DTO | null;

  async create(
    item: CreateReqPayload,
    revalidate = true,
    headers?: Record<string, string>
  ): Promise<DTO> {
    const res: Modal = await callApi(this.prefix, 'POST', item, {
      isMock: this.isMock,
      headers
    });
    revalidate && this.revalidateTags.create.forEach(tag => revalidateTag(tag));

    return this.mapDTO(res);
  }

  async list(
    params: SearchParams<Modal, Record<string, unknown>>
  ): Promise<PaginationRes<DTO>> {
    const res = await callApi<PaginationRes<Modal>>(
      this.prefix,
      'GET',
      params,
      {
        isMock: this.isMock
      }
    );

    if (res.content) {
      const dtos = res.content.map(this.mapDTO);
      return { ...res, content: dtos };
    }
    const dtos: DTO[] = res as any;
    return { content: dtos };
  }

  async get(id: ID): Promise<DTO | null> {
    const res: Modal = await callApi(this.prefix + '/' + id, 'GET', undefined, {
      isMock: this.isMock
    });

    return this.mapDTO(res);
  }

  async update(
    newItem: UpdateReqPayload,
    id: ID,
    revalidate = true,
    headers?: Record<string, string>
  ): Promise<DTO> {
    const res: Modal = await callApi(this.prefix + '/' + id, 'PUT', newItem, {
      isMock: this.isMock,
      headers
    });
    if (revalidate) {
      this.revalidateTags.update.forEach(tag => revalidateTag(tag));
      revalidateTag(this.prefix + '/' + id);
    }
    return this.mapDTO(res);
  }

  async delete(id: ID, revalidate = true): Promise<any> {
    const res: Modal = await callApi(
      this.prefix + '/' + id,
      'DELETE',
      undefined,
      {
        isMock: this.isMock
      }
    );
    if (revalidate) {
      this.revalidateTags.delete.forEach(tag => revalidateTag(tag));
      revalidateTag(this.prefix + '/' + id);
    }
    return res;
  }
}
