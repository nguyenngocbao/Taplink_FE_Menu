import { ID } from './CRUD';

export type ItemModal = {
  id: ID;
  name: string;
  image: string;
  description: string;
  sortOrder: number;
  categoryId: number;
  priceTypeId: number;
  priceInfo: string;
};

export type ItemDTO = {
  id?: ID;
  image: string;
  categoryId: string;
  description: string;
  name: string;
  priceTypeId: PriceType;
  priceInfo: PriceSingle | PriceRange | PriceSize;
};

export type ItemPostReq = FormData;

export type ItemPutReq = FormData;

// price types

// follow server data
export enum PriceType {
  Single = 1,
  Range = 2,
  Size = 3
}

export type PriceSingle = {
  price: number;
};

export type PriceRange = {
  price: [number, number];
};

export type PriceSize = {
  price: Record<PriceSizeType, number>;
};

export enum PriceSizeType {
  S = 1,
  M = 2,
  L = 3
}
