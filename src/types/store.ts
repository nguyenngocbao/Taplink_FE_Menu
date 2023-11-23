import { Option } from '.';

export type StoreAddress = {
  nation: string;
  city: string;
  district: string;
  ward: string;
  detail: string;
};

export type StoreRequest = {
  id: string;
  name: string;
  type?: string;
  phoneNumber: string;
  email?: string;
  image: string;
  address: StoreAddress;
};

export type StoreResponse = StoreRequest;

export type StoreCategoryResponse = {
  id?: string;
  name: string;
  desc: string;
  image: string;
};

export type StoreCategoryResquest = StoreCategoryResponse;

export type StoreType = Option;
