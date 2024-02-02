import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { Option } from '@/types';
import { CityModal, DistrictModal, WardModal } from '@/types/address';
import { bindMethodsToSelf, isOnServer } from '@/utils/common';

export const ADDRESS_APIs = {
  CITY: '/api/v1/cities',
  DISTRICT: '/api/v1/districts'
};

class AddressService {
  constructor() {
    bindMethodsToSelf(AddressService, this);
  }
  mapDTO(res: CityModal | DistrictModal): Option {
    if (!res) return null;
    const dto: Option = {
      label: res.name,
      value: res.id
    };
    return dto;
  }

  async getCities(): Promise<Option[]> {
    let res: CityModal[] = [];
    if (isOnServer()) {
      res = await fetchServer<CityModal[]>(ADDRESS_APIs.CITY, 'GET', {
        noAuth: true
      });
    } else {
      res = await axios.get(ADDRESS_APIs.CITY);
    }

    return res.map(this.mapDTO);
  }

  async getDistricts(cityId: string | number): Promise<Option[]> {
    let res: DistrictModal[] = [];
    if (isOnServer()) {
      res = await fetchServer<DistrictModal[]>(
        `${ADDRESS_APIs.CITY}/${cityId}/districts`,
        'GET',
        {
          noAuth: true
        }
      );
    } else {
      res = await axios.get(`${ADDRESS_APIs.CITY}/${cityId}/districts`);
    }

    return res.map(this.mapDTO);
  }

  async getWards(districtId: string | number): Promise<Option[]> {
    let res: WardModal[] = [];
    if (isOnServer()) {
      res = await fetchServer<WardModal[]>(
        `${ADDRESS_APIs.DISTRICT}/${districtId}/wards`,
        'GET',
        {
          noAuth: true
        }
      );
    } else {
      res = await axios.get(`${ADDRESS_APIs.DISTRICT}/${districtId}/wards`);
    }

    return res.map(this.mapDTO);
  }
}

export const addressService = new AddressService();
