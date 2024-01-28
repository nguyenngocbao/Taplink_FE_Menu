export type CategoryModal = {
  id: number;
  storeId: number;
  name: string;
  description: string;
  templateId: number;
  image?: string;
};

export type CategoryDTO = {
  id: number;
  storeId: number;
  name: string;
  description: string;
  templateId: number;
  image?: string;
};

export type CategoryPostReq = {
  storeId: number;
  name: string;
  description?: string;
  templateId?: number;
  image?: File;
};

export type CategoryPutReq = {
  storeId: number;
  name: string;
  description?: string;
  templateId?: number;
  image?: File | string;
};
