import { Option, OptionRes, PaginationRes, SearchParams } from '@/types';
import { CRUDAbstract } from '@/types/CRUD';
import { StoreDTO, StoreModal, StorePostReq, StorePutReq } from '@/types/store';
import { bindMethodsToSelf, callApi } from '@/utils/common';

export const STORE_APIs = {
  INDEX: '/api/v1/stores'
};

class StoreCRUD extends CRUDAbstract<
  StoreDTO,
  StoreModal,
  StorePostReq,
  StorePutReq
> {
  constructor() {
    super(STORE_APIs.INDEX);
    bindMethodsToSelf(StoreCRUD, this);
  }

  mapDTO(res: StoreModal): StoreDTO {
    if (!res) return null;
    const dto: any = res;
    return dto;
  }

  async getStoreTypes(): Promise<Option[]> {
    const res = await callApi<OptionRes[]>(
      STORE_APIs.INDEX + '/store-type',
      'GET'
    );

    return res.map(type => ({
      label: type.name,
      value: type.id
    }));
  }

  async getStoreMenuTemplates(): Promise<Option[]> {
    const res = await callApi<OptionRes[]>(
      STORE_APIs.INDEX + '/menu-template',
      'GET'
    );
    return res.map(type => ({
      label: type.name,
      value: type.id
    }));
  }

  async getStoresForAdmin(
    params: SearchParams<StoreModal, { userId: number; searchKey?: string }>
  ): Promise<PaginationRes<StoreDTO>> {
    const res = await callApi<PaginationRes<StoreModal>>(
      STORE_APIs.INDEX + '/all',
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
    const dtos: StoreDTO[] = res as any;
    return { content: dtos };
  }
}

export const storeService = new StoreCRUD();
