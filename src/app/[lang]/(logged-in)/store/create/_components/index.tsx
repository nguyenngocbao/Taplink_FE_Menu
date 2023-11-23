'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks';
import { deviceService } from '@/services/device';
import { storeService } from '@/services/store';
import { Option } from '@/types';
import { Store } from '@/types/store';
import { dataURLtoFile, getFormData } from '@/utils/common';

import StoreForm from './StoreForm';

interface StoreCreation {
  cityOptions: Option[];
  storeTypes: Option[];
}

export const StoreCreation: FC<StoreCreation> = ({
  cityOptions,
  storeTypes
}) => {
  const router = useRouter();
  const query = useSearchParams();
  const deviceId = query.get('device_id');

  const createStoreApi = useDataApi(
    storeService.createFormData.bind(storeService)
  );
  const createStore = createStoreApi.call as typeof storeService.createFormData;

  const connectDeviceApi = useDataApi(
    deviceService.connectStore.bind(deviceService)
  );
  const connectDevice =
    connectDeviceApi.call as typeof deviceService.connectStore;

  const onSubmit = useCallback(
    async (values: Store) => {
      const newStore = await createStore(
        getFormData({
          ...values,
          image: dataURLtoFile(values.image, 'image.jpg')
        })
      );
      await connectDevice({
        uuid: deviceId,
        storeId: newStore.id
      });

      toast.success('Create store successfully');
      router.push(STORE_OWNER_ROUTE.STORE + '/' + newStore.id);
    },
    [router]
  );

  return (
    <StoreForm
      storeTypes={storeTypes}
      data={null}
      isLoading={createStoreApi.isLoading || connectDeviceApi.isLoading}
      cityOptions={cityOptions}
      onSubmit={onSubmit}
    />
  );
};
