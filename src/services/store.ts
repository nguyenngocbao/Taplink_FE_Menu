import { revalidateTag } from '@/app/actions';
import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { Option } from '@/types';
import { CRUDAbstract } from '@/types/CRUD';
import { Store, StoreResponse, StoreTypeResponse } from '@/types/store';
import { callApi, isOnServer } from '@/utils/common';

export const STORE_APIs = {
  INDEX: '/api/v1/stores'
};

class StoreCRUD extends CRUDAbstract<Store, StoreResponse> {
  constructor() {
    super(STORE_APIs.INDEX);
  }

  mapDTO(res: StoreResponse): Store {
    if (!res) return null;
    const dto: any = res;
    return dto;
  }

  async createFormData(item: FormData, revalidate = true): Promise<Store> {
    const res: StoreResponse = await callApi(
      STORE_APIs.INDEX,
      'POST',
      item,
      false,
      {
        'content-type': 'multipart/form-data'
      }
    );
    revalidate && revalidateTag(STORE_APIs.INDEX);
    return this.mapDTO(res);
  }

  async getStoreTypes(): Promise<Option[]> {
    let res: StoreTypeResponse[] = null;

    if (isOnServer()) {
      res = await fetchServer(STORE_APIs.INDEX + '/store-type', 'GET');
    } else {
      res = await axios.get(STORE_APIs.INDEX + '/store-type');
    }

    return res.map(type => ({
      label: type.name,
      value: type.id
    }));
  }
}

export const storeService = new StoreCRUD();
