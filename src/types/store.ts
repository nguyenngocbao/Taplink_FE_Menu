export type StoreAddress = {
  nation: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
};

export type StoreDTO = {
  id?: number;
  name: string;
  storeTypeId: number | string;
  image: string;
  address: string;
  fullAddress?: string;
  wardId: number | string;
  cityId: number | string;
  districtId: number | string;
  wifiPass: string;
  storeTemplateId: number;
  menuTemplateId: number;
  phone?: string;
  storeOwnerId: number;
};

export type StoreModal = {
  id: number;
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

export enum StoreType {
  FoodAndDrink = 1,
  Spa = 2
}
