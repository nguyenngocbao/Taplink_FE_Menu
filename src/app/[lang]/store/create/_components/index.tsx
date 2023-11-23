'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

import { STORE_APIS } from '@/apis/store';
import { COMMON_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks/useDataAPI';
import { StoreRequest } from '@/types/store';
import { getFormData } from '@/utils/common';

import StoreForm from './StoreForm';

export const StoreCreation = () => {
  const router = useRouter();
  const createStoreApi = useDataApi(STORE_APIS.STORE);

  const onSubmit = useCallback(
    async (values: StoreRequest) => {
      createStoreApi.post(getFormData(values));
      toast.success('Create store successfully');
      router.push(COMMON_ROUTE.WELCOME);
    },
    [router]
  );

  return (
    <StoreForm
      storeTypes={[]}
      userInfo={null}
      isLoading={false}
      onSubmit={onSubmit}
    />
  );
};
