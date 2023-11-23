import { ID } from './CRUD';

export type StoreAddress = {
  nation: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
};

export type Store = {
  id?: ID;
  name: string;
  storeTypeId: number | string;
  image: string;
  address: string;
  wardId: number | string;
  cityId: number | string;
  districtId: number | string;
  wifiPass: string;
  storeTemplateId: number;
  menuTemplateId: number;
};

export type StoreResponse = {
  id: ID;
  name: string;
  wifiPass: string;
  storeTemplateId: number;
  menuTemplateId: number;
  address: string;
  wardId: number;
  storeTypeId: number;
};

export type StoreCategoryResponse = {
  id?: string;
  name: string;
  desc: string;
  image: string;
};

export type StoreCategoryResquest = StoreCategoryResponse;

export type StoreTypeResponse = {
  id: number;
  code: string;
  name: string;
};
