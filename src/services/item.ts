import { CRUDAbstract } from '@/types/CRUD';
import { ItemRequest, ItemResponse } from '@/types/item';

export const ITEM_APIs = {
  INDEX: '/api/v1/items'
};

class ItemCRUD extends CRUDAbstract<ItemRequest, ItemResponse> {
  constructor() {
    super(ITEM_APIs.INDEX, true);
  }

  mapDTO(res: ItemResponse): ItemRequest {
    if (!res) return null;
    const dto: any = res;
    return dto;
  }
}

export const itemService = new ItemCRUD();
