import axios from '@/lib/axios';
import fetchServer from '@/lib/fetch-server';
import { Option } from '@/types';
import { City, District, Ward } from '@/types/address';
import { isOnServer } from '@/utils/common';

export const ADDRESS_APIs = {
  CITY: '/api/v1/cities',
  DISTRICT: '/api/v1/districts'
};

class AddressService {
  mapDTO(res: City | District): Option {
    if (!res) return null;
    const dto: Option = {
      label: res.name,
      value: res.id
    };
    return dto;
  }

  async getCities(): Promise<Option[]> {
    let res: City[] = [];
    if (isOnServer()) {
      res = await fetchServer<City[]>(ADDRESS_APIs.CITY, 'GET', {
        noAuth: true
      });
    } else {
      res = await axios.get(ADDRESS_APIs.CITY);
    }

    return res.map(this.mapDTO);
  }

  async getDistricts(cityId: string | number): Promise<Option[]> {
    let res: District[] = [];
    if (isOnServer()) {
      res = await fetchServer<District[]>(
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
    let res: Ward[] = [];
    if (isOnServer()) {
      res = await fetchServer<Ward[]>(
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
