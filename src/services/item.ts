import { Option, OptionRes } from '@/types';
import { CRUDAbstract } from '@/types/CRUD';
import { ItemDTO, ItemModal, ItemPostReq, ItemPutReq } from '@/types/item';
import { callApi } from '@/utils/common';

export const ITEM_APIs = {
  INDEX: '/api/v1/items'
};

class ItemCRUD extends CRUDAbstract<
  ItemDTO,
  ItemModal,
  ItemPostReq,
  ItemPutReq
> {
  constructor() {
    super(ITEM_APIs.INDEX);
  }

  mapDTO(res: ItemModal): ItemDTO {
    if (!res) return null;
    const dto: ItemDTO = {
      ...res,
      categoryId: String(res.categoryId),
      priceInfo: JSON.parse(res.priceInfo)
    };
    return dto;
  }

  async getPriceTypes(): Promise<Option[]> {
    const res = await callApi<OptionRes[]>(this.prefix + '/price-type', 'GET');
    return res.map(t => ({ label: t.name, value: t.id }));
  }
}

export const itemService = new ItemCRUD();
