import { CategoryRequest, CategoryResponse } from '@/types/category';
import { CRUDAbstract } from '@/types/CRUD';

export const CATEGORY_APIs = {
  INDEX: '/api/v1/categories'
};

class CategoryCRUD extends CRUDAbstract<CategoryRequest, CategoryResponse> {
  constructor() {
    super(CATEGORY_APIs.INDEX, true);
  }

  mapDTO(res: CategoryResponse): CategoryRequest {
    if (!res) return null;
    const dto: any = res;
    return dto;
  }
}

export const categoryService = new CategoryCRUD();
