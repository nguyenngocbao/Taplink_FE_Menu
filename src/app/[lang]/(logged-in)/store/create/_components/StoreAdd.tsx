'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { StoreForm } from '@/components/features';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks';
import { useCreate } from '@/hooks/features';
import { deviceService } from '@/services/device';
import { storeService } from '@/services/store';
import { Option } from '@/types';
import { StoreDTO } from '@/types/store';
import { dataURLtoFile, getFormData } from '@/utils/common';

interface StoreAdd {
  cityOptions: Option[];
  storeTypes: Option[];
}

export const StoreAdd: FC<StoreAdd> = ({ cityOptions, storeTypes }) => {
  const router = useRouter();
  const query = useSearchParams();
  const deviceId = query.get('device_id');

  const { createItem, isCreating } = useCreate({ service: storeService });

  const connectDeviceApi = useDataApi(
    deviceService.connectStore.bind(deviceService)
  );
  const connectDevice =
    connectDeviceApi.call as typeof deviceService.connectStore;

  const onSubmit = useCallback(
    async (values: StoreDTO) => {
      const { image, ...data } = values;
      const newStore = await createItem(
        getFormData({
          ...data,
          ...(image && {
            image: dataURLtoFile(image, 'image.png')
          })
        }),
        false,
        {
          'content-type': 'multipart/form-data'
        }
      );

      if (deviceId) {
        await connectDevice({
          uuid: deviceId,
          storeId: newStore.id
        });
      }

      toast.success('Create store successfully');
      router.push(STORE_OWNER_ROUTE.STORE + '/' + newStore.id);
    },
    [router]
  );

  return (
    <StoreForm
      storeTypes={storeTypes}
      data={null}
      isLoading={isCreating || connectDeviceApi.isLoading}
      cityOptions={cityOptions}
      onSubmit={onSubmit}
    />
  );
};
