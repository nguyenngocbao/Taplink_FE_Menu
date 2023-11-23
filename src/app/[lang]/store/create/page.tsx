// import { ADDRESS_APIS } from '@/apis/address';
// import { STORE_APIS } from '@/apis/store';
// import fetchServer from '@/lib/fetch-server';
// import { AddressResponse } from '@/types/address';
// import { StoreType } from '@/types/store';

import { StoreCreation } from './_components';

export const metadata = {
  title: 'Store creation',
  description: 'Create a new store in taplink'
};

export default async function () {
  // const storeTypes = await fetchServer<StoreType[]>(STORE_APIS.STORE_TYPE);
  // const address = await fetchServer<AddressResponse>(ADDRESS_APIS.GET);

  // console.log(storeTypes, address);

  return (
    <main className="px-[16px] py-[29px]">
      <StoreCreation />
    </main>
  );
}
