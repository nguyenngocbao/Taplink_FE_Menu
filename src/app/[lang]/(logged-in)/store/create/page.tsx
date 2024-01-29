import { addressService } from '@/services/address';
import { storeService } from '@/services/store';

import { StoreAdd } from './_components/StoreAdd';

export const metadata = {
  title: 'Store creation',
  description: 'Create a new store in taplink'
};

export default async function () {
  const [cityOptions, storeTypes] = await Promise.all([
    addressService.getCities(),
    storeService.getStoreTypes()
  ]);

  return (
    <main className="px-[16px] py-[29px]">
      <StoreAdd cityOptions={cityOptions} storeTypes={storeTypes} />
    </main>
  );
}
