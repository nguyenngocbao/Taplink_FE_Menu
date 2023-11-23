'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { StoreRequest } from '@/types/store';

import StoreForm from './_components/StoreForm';

export default function () {
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: StoreRequest) => {
      console.log(values);
      // toast.success('追加しました');
      // router.push(ADMIN_ROUTE.DASHBOARD.USER.LIST);
    },
    [router]
  );

  return (
    <main className="px-[16px] py-[29px]">
      <StoreForm
        storeTypes={[]}
        userInfo={null}
        isLoading={false}
        onSubmit={onSubmit}
      />
    </main>
  );
}
