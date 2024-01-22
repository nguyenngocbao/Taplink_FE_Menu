export type CityModal = {
  id: number;
  name: string;
  code: string;
};

export type DistrictModal = {
  id: number;
  name: string;
  code: string;
  cityId: number;
};

export type WardModal = {
  id: number;
  name: string;
  code: string;
  districtId: number;
};
