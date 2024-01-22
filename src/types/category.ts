import { ID } from './CRUD';

export type CategoryModal = {
  id: ID;
  storeId: ID;
  name: string;
  description: string;
  templateId: number;
};

export type CategoryDTO = {
  id: ID;
  storeId: ID;
  name: string;
  description: string;
  templateId: number;
};

export type CategoryPostReq = {
  storeId: ID;
  name: string;
  description?: string;
  templateId: number;
};

export type CategoryPutReq = CategoryPostReq;
