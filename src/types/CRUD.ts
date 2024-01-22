import { revalidateTag } from '@/app/actions';
import { callApi } from '@/utils/common';

import { PaginationRes } from '.';

export interface useCRUDServiceProps<
  DTO extends { id?: ID },
  Modal = unknown,
  CreateReqPayload = DTO,
  UpdateReqPayload = CreateReqPayload
> {
  service: CRUDAbstract<DTO, Modal, CreateReqPayload, UpdateReqPayload>;
}

export type ID = number | string;

export interface CRUDInterface<DTO, CreateReqPayload, UpdateReqPayload> {
  prefix: string;
  isMock: boolean;
  create(
    item: CreateReqPayload,
    revalidate?: boolean,
    headers?: Record<string, string>
  ): Promise<DTO>;
  list(params: Record<string, unknown>): Promise<PaginationRes<DTO>>;
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
  Modal,
  CreateReqPayload = Modal,
  UpdateReqPayload = CreateReqPayload
> implements CRUDInterface<DTO, CreateReqPayload, UpdateReqPayload>
{
  prefix: string;
  isMock: boolean;

  constructor(prefix: string, isMock?: boolean) {
    this.prefix = prefix;
    this.isMock = isMock;
  }

  abstract mapDTO(res: Modal): DTO;

  async create(
    item: CreateReqPayload,
    revalidate = true,
    headers?: Record<string, string>
  ): Promise<DTO> {
    const res: Modal = await callApi(
      this.prefix,
      'POST',
      item,
      this.isMock,
      headers
    );
    revalidate && revalidateTag(this.prefix);
    return this.mapDTO(res);
  }

  async list(params): Promise<PaginationRes<DTO>> {
    const res = await callApi<PaginationRes<Modal>>(
      this.prefix,
      'GET',
      params,
      this.isMock
    );

    if (res.content) {
      const dtos = res.content.map(this.mapDTO);
      return { ...res, content: dtos };
    }
    const dtos: DTO[] = res as any;
    return { content: dtos };
  }

  async get(id: ID): Promise<DTO | null> {
    try {
      const res: Modal = await callApi(
        this.prefix + '/' + id,
        'GET',
        undefined,
        this.isMock
      );
      return this.mapDTO(res);
    } catch (e) {
      console.log(e);
    }
  }

  async update(
    newItem: UpdateReqPayload,
    id: ID,
    revalidate = true,
    headers?: Record<string, string>
  ): Promise<DTO> {
    const res: Modal = await callApi(
      this.prefix + '/' + id,
      'PUT',
      newItem,
      this.isMock,
      headers
    );
    revalidate && revalidateTag(this.prefix);
    return this.mapDTO(res);
  }

  async delete(id: ID, revalidate = true): Promise<any> {
    const res: Modal = await callApi(
      this.prefix + '/' + id,
      'DELETE',
      undefined,
      this.isMock
    );
    revalidate && revalidateTag(this.prefix);
    return res;
  }
}
