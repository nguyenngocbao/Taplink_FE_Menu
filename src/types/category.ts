import { ID } from './CRUD';

export type CategoryResponse = {
  id: ID;
  storeId: number;
  name: string;
  description: string;
  templateId: number;
};

export type CategoryRequest = {
  id: ID;
  storeId: number;
  name: string;
  description: string;
  templateId: number;
};
