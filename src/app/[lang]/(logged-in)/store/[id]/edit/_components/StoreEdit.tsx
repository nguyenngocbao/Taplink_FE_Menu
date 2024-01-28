'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { StoreForm } from '@/components/features';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks';
import { useUpdate } from '@/hooks/features';
import { deviceService } from '@/services/device';
import { storeService } from '@/services/store';
import { Option } from '@/types';
import { StoreDTO } from '@/types/store';
import { dataURLtoFile, getFormData, isValidHttpUrl } from '@/utils/common';

interface StoreEdit {
  initCityOptions: Option[];
  initWardOptions: Option[];
  initDistrictOptions: Option[];
  storeTypes: Option[];
  data: StoreDTO;
}

export const StoreEdit: FC<StoreEdit> = ({
  initCityOptions,
  initDistrictOptions,
  initWardOptions,
  storeTypes,
  data
}) => {
  const { t } = useTranslation('myPage');
  const router = useRouter();
  const query = useSearchParams();
  const deviceId = query.get('device_id');

  const { updateItem, isUpdating } = useUpdate({ service: storeService });

  const connectDeviceApi = useDataApi(
    deviceService.connectStore.bind(deviceService)
  );
  const connectDevice =
    connectDeviceApi.call as typeof deviceService.connectStore;

  const onSubmit = async (values: StoreDTO) => {
    const { image, ..._data } = values;
    const newStore = await updateItem(
      getFormData({
        ..._data,
        ...(image &&
          !isValidHttpUrl(image) && {
            image: dataURLtoFile(image, 'image.png')
          })
      }),
      data.id,
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

    toast.success(t('updateStoreSuccess'));
    router.push(STORE_OWNER_ROUTE.STORE + '/' + newStore.id);
  };

  return (
    <StoreForm
      storeTypes={storeTypes}
      data={data}
      isLoading={isUpdating || connectDeviceApi.isLoading}
      initCityOptions={initCityOptions}
      initDistrictOptions={initDistrictOptions}
      initWardOptions={initWardOptions}
      onSubmit={onSubmit}
    />
  );
};
