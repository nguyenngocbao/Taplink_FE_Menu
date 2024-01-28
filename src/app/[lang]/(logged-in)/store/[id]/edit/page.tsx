import { addressService } from '@/services/address';
import { storeService } from '@/services/store';

import { StoreEdit } from './_components/StoreEdit';

export const metadata = {
  title: 'Store editing',
  description: 'Update a store in taplink'
};

export default async function ({ params: { id } }) {
  const storeTypes = await storeService.getStoreTypes();
  const store = await storeService.get(id);
  const initCityOptions = await addressService.getCities();
  const initDistrictOptions = await addressService.getDistricts(store.cityId);
  const initWardOptions = await addressService.getWards(store.districtId);

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
