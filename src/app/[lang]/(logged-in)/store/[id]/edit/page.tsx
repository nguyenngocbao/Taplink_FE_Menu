import { addressService } from '@/services/address';
import { storeService } from '@/services/store';

import { StoreEdit } from './_components/StoreEdit';

export const metadata = {
  title: 'Store editing',
  description: 'Update a store in taplink'
};

export default async function ({ params: { id } }) {
  const cityOptions = await addressService.getCities();
  const storeTypes = await storeService.getStoreTypes();
  const store = await storeService.get(id);

  return (
    <main className="px-[16px] py-[29px]">
      <StoreEdit
        cityOptions={cityOptions}
        storeTypes={storeTypes}
        data={store}
      />
    </main>
  );
}
