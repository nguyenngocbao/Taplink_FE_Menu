import Image from 'next/image';

import { useTranslation } from '@/app/i18n';
import MarkerBlack from '@/assets/icon/marker-black.svg';
import PencilWhite from '@/assets/icon/pencil-white.svg';
import PhoneBlack from '@/assets/icon/phone-black.svg';
import NoImage from '@/assets/image/no-image.svg';
import { MENU_TEMPLATES } from '@/constants/template';
import { categoryService } from '@/services/category';
import { itemService } from '@/services/item';
import { storeService } from '@/services/store';
import { Option } from '@/types';
import { StoreType } from '@/types/store';

import { CategoryCreation } from './_components/CategoryCreation';
import { BasicLayout } from './_components/layouts/Basic';
import { GroupLayout } from './_components/layouts/Group';

export default async function ({ params: { lang, id } }) {
  const { t } = await useTranslation(lang, 'myPage');
  const store = await storeService.get(id);
  const categoryRes = await categoryService.list({ storeId: id });
  const priceTypeRes = await itemService.getPriceTypes();
  const categories: Option[] = categoryRes.content.map(cate => ({
    label: cate.name,
    value: cate.id
  }));

  console.log(store);

  return (
    <main className="relative items-center p-[16px] text-center">
      <div className="absolute left-0 top-0 z-[-1] h-[139px] w-screen rounded-b-[10px]">
        <Image
          className="z-[-1] bg-primary-bg object-cover"
          fill
          src={store?.image || NoImage}
          alt=""
        />
      </div>
      <div className="absolute left-0 top-0 z-[-1] h-[139px] w-screen rounded-b-[10px] bg-primary/80"></div>
      <>
        <div className="mb-[16px] flex items-center justify-between">
          <p className="text-white">{t('shopInfo')}</p>
          <button>
            <Image src={PencilWhite} alt="" />
          </button>
        </div>
        <div className="relative mb-[38px] flex h-[215px] w-full flex-col justify-end overflow-hidden rounded-[10px] px-[12px] py-[18px] text-left">
          <Image
            className="z-[-1] bg-primary-bg object-cover"
            fill
            src={store?.image || NoImage}
            alt=""
          />
          <div className="absolute bottom-0 left-0 z-[-1] h-[141px] w-full bg-[linear-gradient(360deg,_#F1F5FF_23.44%,_rgba(241,_245,_255,_0.57)_66.15%,_rgba(241,_245,_255,_0.00)_100%)]"></div>
          <h3 className="mb-[6px] text-[18px]/[21.6px] font-[800]">
            {store.name}
          </h3>

          <div className="text-[14px]/[19.6px] font-bold">
            <p className="mb-[4px] flex items-center gap-[6px]">
              <Image src={PhoneBlack} alt="" className="h-[13px] w-[13px]" />
              <span>{store.phone}</span>
            </p>
            <p className="flex items-start gap-[6px]">
              <Image
                src={MarkerBlack}
                alt=""
                className="mt-[1px] h-[13px] w-[15px]"
              />
              <span>{store.address}</span>
            </p>
          </div>
        </div>

        <div className="mb-[12px] flex items-center justify-between">
          <span className="text-[20px]/[24px] font-bold text-[#000]">
            {t('category')}
          </span>
          <CategoryCreation storeId={id} />
        </div>
        {store?.storeTypeId === StoreType.FoodAndDrink && (
          <BasicLayout
            menuTemplates={MENU_TEMPLATES}
            categories={categories}
            store={store}
            priceTypes={priceTypeRes}
          />
        )}

        {store.storeTypeId === StoreType.Spa && <GroupLayout />}
      </>
    </main>
  );
}
