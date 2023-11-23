import { ID } from './CRUD';

export type ItemResponse = {
  id: ID;
  name: string;
  description: string;
  sortOrder: number;
  priceTypeId: number;
  categoryId: number;
  priceInfo: string;
};

export type ItemRequest = {
  id?: string;
  image: string;
  category: string;
  name: string;
  priceType: string;
  prices: string[];
};
