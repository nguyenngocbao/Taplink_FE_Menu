import { ID } from './CRUD';

export type StoreAddress = {
  nation: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
};

export type StoreDTO = {
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
  phone?: string;
};

export type StoreModal = {
  id: ID;
  name: string;
  wifiPass: string;
  storeTemplateId: number;
  menuTemplateId: number;
  address: string; // full address
  wardId: number;
  storeTypeId: number;
};

export type StorePostReq = FormData;

export type StorePutReq = FormData;

export type StoreCategoryModal = {
  id?: string;
  storeId: number;
  templateId: number;
  description: string;
  name: string;
  image: string;
};

export type StoreCategoryPostReq = StoreCategoryModal;

export enum StoreType {
  FoodAndDrink = 1,
  Spa = 2
}
