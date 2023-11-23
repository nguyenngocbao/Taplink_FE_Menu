'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import MarkerIcon from '@/assets/image/marker.png';
import { Button, Dialog, InputField } from '@/components/core';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi, useDisclosure } from '@/hooks';
import { storeService } from '@/services/store';
import { Store } from '@/types/store';
import { mergeQueryParams } from '@/utils/common';

import { SearchIcon } from './SearchIcon';
import { StoreItem, StoreItemSkeleton } from './StoreItem';

export const ChooseExistedStore = ({ isInitialOpen }) => {
  const { t } = useTranslation(['welcome', 'common']);
  const { isOpen, open, close } = useDisclosure(isInitialOpen);
  const [keyword, setKeyword] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  const getStore = useDataApi<Store[]>(storeService.list.bind(storeService));

  const onSearchByKeyword = () => {
    console.log(keyword);
    setSelectedStoreId(null);
  };

  const onOpen = () => {
    const newUrl = mergeQueryParams({ option: 'open_choosing_store' });
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      document.title,
      newUrl
    );

    if (status === 'loading') {
      toast.info('Please try again');
    }

    if (session) {
      open();
    } else {
      router.push(
        `${STORE_OWNER_ROUTE.LOGIN}?callbackUrl=${location.pathname}${location.search}`
      );
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        className="flex w-full items-center justify-start gap-[17px] rounded-[10px] bg-primary-bg px-[20px] py-[17px] text-left"
      >
        <Image
          src={MarkerIcon}
          alt="check-list"
          className="h-[60px] w-[58px] object-contain"
        />
        <div>
          <h2 className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
            {t('hasExistedStore')}
          </h2>
          <p className="text-[16px]/[22.4px] font-normal text-black">
            {t('hasExistedStoreDesc')}
          </p>
        </div>
      </button>
      <Dialog title={t('chooseYourStore')} isOpen={isOpen} onClose={close}>
        <div className="mb-[10px]">
          <InputField
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            sufixIcon={<SearchIcon className="h-[20px] w-[20px]" />}
            onClickSufixIcon={() => onSearchByKeyword()}
          />
        </div>
        <div className="no-scrollbar relative flex h-[calc(100vh_-_230px)] w-[calc(100vw_-_64px)] flex-col gap-[16px] overflow-scroll p-[2px]">
          {getStore.isLoading ? (
            <StoreItemSkeleton length={4} />
          ) : (
            (getStore.data ?? [])?.map(store => (
              <StoreItem
                data={store}
                key={store.id}
                onClick={() => setSelectedStoreId(store.id)}
                className={
                  selectedStoreId === store.id
                    ? 'shadow-[0_0_0_2px_#1540C3]'
                    : ''
                }
              />
            ))
          )}
        </div>
        <div className="mt-[10px] flex justify-end gap-[10px]">
          <Link className="w-full" href={`/login?store_id=${selectedStoreId}`}>
            <Button disabled={selectedStoreId == null} className="w-full">
              {t('label.next', { ns: 'common' })}
            </Button>
          </Link>
        </div>
      </Dialog>
    </>
  );
};
