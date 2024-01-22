import {
  CategoryDTO,
  CategoryModal,
  CategoryPostReq,
  CategoryPutReq
} from '@/types/category';
import { CRUDAbstract } from '@/types/CRUD';
import { callApi } from '@/utils/common';

export const CATEGORY_APIs = {
  INDEX: '/api/v1/categories'
};

class CategoryCRUD extends CRUDAbstract<
  CategoryDTO,
  CategoryModal,
  CategoryPostReq,
  CategoryPutReq
> {
  constructor() {
    super(CATEGORY_APIs.INDEX);
  }

  mapDTO(res: CategoryModal): CategoryDTO {
    if (!res) return null;
    const dto: any = res;
    return dto;
  }

  async getTemplates(): Promise<any> {
    return callApi(`${CATEGORY_APIs.INDEX}/templates`, 'GET');
  }
}

export const categoryService = new CategoryCRUD();
