import Image from 'next/image';
import Link from 'next/link';

import { Header } from '@/components/Layouts/Header';

import { useTranslation } from '../i18n';

import CheckListIcon from './_assets/checklist.png';
import MarkerIcon from './_assets/marker.png';

export default async function Home({ params: { lang } }) {
  const { t } = await useTranslation(lang, 'welcome');

  return (
    <>
      <Header />
      <main className="flex flex-col items-center px-[16px] py-[19px]">
        <Image
          src=""
          alt="phone-chat"
          className="mb-[27px] h-[291px] w-[288px] bg-gray-50 object-cover object-center"
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
            href="/shop/create"
            className="mb-[16px] flex items-center gap-[17px] rounded-[10px] bg-primary-bg px-[20px] py-[17px]"
          >
            <Image
              src={CheckListIcon}
              alt="check-list"
              className="h-[60px] w-[58px] object-contain"
            />
            <div>
              <h2 className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
                {t('createNewShop')}
              </h2>
              <p className="text-[16px]/[22.4px] font-normal text-[#171717]">
                {t('createNewShopDesc')}
              </p>
            </div>
          </Link>
          <button className="flex w-full items-center justify-start gap-[17px] rounded-[10px] bg-primary-bg px-[20px] py-[17px] text-left">
            <Image
              src={MarkerIcon}
              alt="check-list"
              className="h-[60px] w-[58px] object-contain"
            />
            <div>
              <h2 className="mb-[4px] text-[20px]/[24px] font-bold text-primary">
                {t('hasExistedShop')}
              </h2>
              <p className="text-[16px]/[22.4px] font-normal text-[#171717]">
                {t('hasExistedShopDesc')}
              </p>
            </div>
          </button>
        </div>
      </main>
    </>
  );
}
