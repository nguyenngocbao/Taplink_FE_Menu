'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { STORE_APIS } from '@/apis/store';
import MarkerIcon from '@/app/[lang]/_assets/marker.png';
import { useTranslation } from '@/app/i18n/client';
import { Button, Dialog, InputField } from '@/components/Elements';
import { useDataApi } from '@/hooks/useDataAPI';
import { useDisclosure } from '@/hooks/useDisclosure';
import { StoreResponse } from '@/types/store';

import { SearchIcon } from './SearchIcon';
import { StoreItem, StoreItemSkeleton } from './StoreItem';

export const ChooseExistedStore = () => {
  const { t } = useTranslation(['welcome', 'common']);
  const { isOpen, open, close } = useDisclosure();
  const [keyword, setKeyword] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const getStoreApi = useDataApi<StoreResponse[]>(STORE_APIS.GET);

  const onSearchByKeyword = () => {
    console.log(keyword);
    getStoreApi.get();
    setSelectedStoreId(null);
  };

  useEffect(() => {
    getStoreApi.get();
  }, []);

  console.log(getStoreApi.data);

  return (
    <>
      <button
        onClick={open}
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
          {getStoreApi.loading ? (
            <StoreItemSkeleton length={4} />
          ) : (
            getStoreApi.data?.map(store => (
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
