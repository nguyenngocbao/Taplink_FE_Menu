'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import MarkerIcon from '@/assets/image/marker.png';
import { Button, Dialog, InputField, Spinner } from '@/components/core';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi, useDisclosure, useSearch } from '@/hooks';
import { deviceService } from '@/services/device';
import { storeService } from '@/services/store';
import { mergeQueryParams } from '@/utils/common';

import { SearchIcon } from './SearchIcon';
import { StoreItem, StoreItemSkeleton } from './StoreItem';

export const ChooseExistedStore = ({
  isInitialOpen,
  initialSession
}: {
  isInitialOpen: boolean;
  initialSession: Session;
}) => {
  const query = useSearchParams();
  const deviceId = query.get('device_id');

  const { t } = useTranslation(['welcome', 'common']);
  const { isOpen, open, close } = useDisclosure(isInitialOpen);
  const [keyword, setKeyword] = useState('');
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const { data: _session, status } = useSession();
  const session = _session ?? initialSession;

  const router = useRouter();
  const userId = session?.user?.id;
  const role = session?.user?.role;
  const connectDevice = useDataApi(deviceService.connectStore);

  const {
    data,
    isLoading,
    isInitialLoading,
    searchParams,
    onChangePage,
    onSearch
  } = useSearch({
    func: role === 'admin' ? storeService.getStoresForAdmin : storeService.list,
    useQueryParams: false,
    initialParams: { userId },
    enable: !!userId
  });

  const [list, setList] = useState([]);

  useEffect(() => {
    setList(pre =>
      searchParams.pageNo === 0
        ? data?.content ?? []
        : [...pre, ...(data?.content ?? [])]
    );
  }, [data]);

  const onSearchByKeyword = (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    setSelectedStoreId(null);
    setList([]);
    onSearch({ searchKey: keyword, userId: userId });
  };

  const onClickNext = async () => {
    if (deviceId && selectedStoreId) {
      await connectDevice.call({
        uuid: deviceId,
        storeId: selectedStoreId
      });
      toast.success(t('successConnect'));
    }
    router.push(`${STORE_OWNER_ROUTE.STORE}/${selectedStoreId}`);
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
            {role === 'admin' ? t('storeList') : t('hasExistedStore')}
          </h2>
          <p className="text-[16px]/[22.4px] font-normal text-black">
            {role === 'admin' ? t('storeListDesc') : t('hasExistedStoreDesc')}
          </p>
        </div>
      </button>
      <Dialog title={t('chooseYourStore')} isOpen={isOpen} onClose={close}>
        <form onSubmit={onSearchByKeyword} className="mb-[10px]">
          <InputField
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            sufixIcon={<SearchIcon className="h-[20px] w-[20px]" />}
            onClickSufixIcon={() => onSearchByKeyword()}
          />
        </form>
        <div
          onScroll={e => {
            const { scrollTop, scrollHeight, clientHeight } =
              e.target as HTMLDivElement;

            if (scrollTop + clientHeight >= scrollHeight) {
              if (!data.last && !isLoading) {
                onChangePage(searchParams.pageNo + 1);
              }
            }
          }}
          className="no-scrollbar relative flex h-[calc(100vh_-_230px)] w-[calc(100vw_-_64px)] flex-col items-center gap-[16px] overflow-scroll p-[2px]"
        >
          {(list ?? [])?.map(store => (
            <StoreItem
              data={store}
              key={store.id}
              onClick={() => setSelectedStoreId(store.id)}
              className={
                selectedStoreId === store.id ? 'shadow-[0_0_0_2px_#1540C3]' : ''
              }
            />
          ))}
          {isInitialLoading && <StoreItemSkeleton length={4} />}
          {!list?.length && !isLoading && searchParams?.searchKey && (
            <p className="mt-[10px]">{`${t('noStore')} "${
              searchParams?.searchKey
            }"`}</p>
          )}

          {!isInitialLoading && isLoading && (
            <div className="flex h-[40px] w-full shrink-0 justify-center">
              <Spinner isCenter={false} className="mx-auto" />
            </div>
          )}
        </div>
        <div className="mt-[10px] flex justify-end gap-[10px]">
          <Button
            disabled={selectedStoreId == null || connectDevice.isLoading}
            isLoading={connectDevice.isLoading}
            onClick={onClickNext}
            className="w-full"
          >
            {deviceId ? t('connect') : t('label.next', { ns: 'common' })}
          </Button>
        </div>
      </Dialog>
    </>
  );
};
