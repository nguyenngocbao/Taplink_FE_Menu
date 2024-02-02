'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { StoreForm } from '@/components/features';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks';
import { deviceService } from '@/services/device';
import { storeService } from '@/services/store';
import { Option } from '@/types';
import { StoreDTO } from '@/types/store';
import {
  dataURLtoFile,
  getCompressedImage,
  getFormData,
  isValidHttpUrl
} from '@/utils/common';

interface StoreAdd {
  cityOptions: Option[];
  storeTypes: Option[];
}

export const StoreAdd: FC<StoreAdd> = ({ cityOptions, storeTypes }) => {
  const router = useRouter();
  const query = useSearchParams();
  const deviceId = query.get('device_id');
  const { t } = useTranslation('myPage');

  const createStoreApi = useDataApi(storeService.create);
  const compressImgApi = useDataApi(getCompressedImage);

  const connectDeviceApi = useDataApi(deviceService.connectStore);
  const connectDevice =
    connectDeviceApi.call as typeof deviceService.connectStore;

  const onSubmit = useCallback(
    async (values: StoreDTO) => {
      const { image, ...data } = values;
      const newStore = await createStoreApi.call(
        getFormData({
          ...data,
          ...(image &&
            !isValidHttpUrl(image) && {
              image: await compressImgApi.call(
                dataURLtoFile(image, 'image.png')
              )
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

      toast.success(t('createStoreSuccess'));
      router.push(STORE_OWNER_ROUTE.STORE + '/' + newStore.id);
    },
    [router]
  );

  return (
    <StoreForm
      storeTypes={storeTypes}
      data={null}
      isLoading={
        createStoreApi.isLoading ||
        connectDeviceApi.isLoading ||
        compressImgApi.isLoading
      }
      initCityOptions={cityOptions}
      onSubmit={onSubmit}
    />
  );
};
