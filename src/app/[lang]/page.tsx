import Image from 'next/image';
import Link from 'next/link';

import CheckListIcon from '@/assets/image/checklist.png';
import PhoneChat from '@/assets/image/phone-chat.svg';
import { STORE_OWNER_ROUTE } from '@/constants/routes';

import { useTranslation } from '../i18n';

import { ChooseExistedStore } from './_components/ChooseExistedStore';

export const metadata = {
  title: 'Taplink',
  description: 'Welcome to taplink'
};

export default async function Home({ params: { lang }, searchParams }) {
  const isOpenChoosingStore = !!searchParams?.['open_choosing_store'];
  const deviceId = searchParams?.['device_id'];
  const { t } = await useTranslation(lang, ['welcome', 'common']);

  return (
    <>
      <main className="flex flex-col items-center px-[16px] py-[19px]">
        <Image
          src={PhoneChat}
          alt="phone-chat"
          className="mb-[27px] h-[291px] object-cover object-center"
        />
        <div className="mb-[35px] text-center font-bold">
          <h2 className="text-[20px]/[24px] text-neutra900">
            {t('welcomeTo')}
          </h2>
          <h1 className="text-[36px]/[43px] text-primary-basic">
            {t('title')}
          </h1>
        </div>
        <div>
          <Link
            href={{
              pathname: STORE_OWNER_ROUTE.CREATE_STORE,
              search: deviceId ? `device_id=${deviceId}` : ''
            }}
            className="mb-[16px] flex items-center gap-[17px] rounded-[10px] bg-primary-bg px-[20px] py-[17px]"
          >
            <Image
              src={CheckListIcon}
              alt="check-list"
              className="h-[60px] w-[58px] object-contain"
            />
            <div>
              <h2 className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
                {t('createNewStore')}
              </h2>
              <p className="text-[16px]/[22.4px] font-normal text-black">
                {t('createNewStoreDesc')}
              </p>
            </div>
          </Link>
          <ChooseExistedStore isInitialOpen={isOpenChoosingStore} />
        </div>
      </main>
    </>
  );
}
