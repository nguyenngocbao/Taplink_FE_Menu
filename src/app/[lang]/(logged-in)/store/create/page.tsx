import { addressService } from '@/services/address';
import { storeService } from '@/services/store';

import { StoreCreation } from './_components';

export const metadata = {
  title: 'Store creation',
  description: 'Create a new store in taplink'
};

export default async function () {
  const cityOptions = await addressService.getCities();
  const storeTypes = await storeService.getStoreTypes();

  return (
    <main className="px-[16px] py-[29px]">
      <StoreCreation cityOptions={cityOptions} storeTypes={storeTypes} />
    </main>
  );
}
