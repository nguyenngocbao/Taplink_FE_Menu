export type City = {
  id: number;
  name: string;
  code: string;
};

export type District = {
  id: number;
  name: string;
  code: string;
  cityId: number;
};

export type Ward = {
  id: number;
  name: string;
  code: string;
  districtId: number;
};
