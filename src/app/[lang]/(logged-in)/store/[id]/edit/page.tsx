import { addressService } from '@/services/address';
import { storeService } from '@/services/store';

import { StoreEdit } from './_components/StoreEdit';

export const metadata = {
  title: 'Store editing',
  description: 'Update a store in taplink'
};

export default async function ({ params: { id } }) {
  const promises = Promise.all([
    storeService.getStoreTypes(),
    addressService.getCities()
  ]);

  const store = await storeService.get(id);
  const [initDistrictOptions, initWardOptions] = await Promise.all([
    addressService.getDistricts(store.cityId),
    addressService.getWards(store.districtId)
  ]);
  const [storeTypes, initCityOptions] = await promises;

  return (
    <main className="px-[16px] py-[29px]">
      <StoreEdit
        initCityOptions={initCityOptions}
        initDistrictOptions={initDistrictOptions}
        initWardOptions={initWardOptions}
        storeTypes={storeTypes}
        data={store}
      />
    </main>
  );
}
