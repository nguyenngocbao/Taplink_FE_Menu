import Image from 'next/image';

import MarkerBlack from '@/app/[lang]/_assets/marker-black.svg';
import NoImage from '@/app/[lang]/_assets/no-image.svg';
import PencilWhite from '@/app/[lang]/_assets/pencil-white.svg';
import PhoneBlack from '@/app/[lang]/_assets/phone-black.svg';
import { useTranslation } from '@/app/i18n';

import { CafeLayout } from './_components/CafeLayout';
import { CategoryCreation } from './_components/CategoryCreation';

export default async function ({ params: { lang } }) {
  const { t } = await useTranslation(lang, 'myPage');
  return (
    <main className="relative items-center p-[16px] text-center">
      <div className="absolute left-0 top-0 z-[-1] h-[139px] w-screen rounded-b-[10px]">
        <Image
          className="z-[-1] bg-primary-bg object-cover"
          fill
          src={NoImage}
          alt=""
        />
      </div>
      <div className="absolute left-0 top-0 z-[-1] h-[139px] w-screen rounded-b-[10px] bg-primary/80"></div>
      <div>
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
            src={NoImage}
            alt=""
          />
          <div className="absolute bottom-0 left-0 z-[-1] h-[141px] w-full bg-[linear-gradient(360deg,_#F1F5FF_23.44%,_rgba(241,_245,_255,_0.57)_66.15%,_rgba(241,_245,_255,_0.00)_100%)]"></div>
          <h3 className="mb-[6px] text-[18px]/[21.6px] font-[800]">
            The coffee House Ngô Thì Nhậm
          </h3>

          <div className="text-[14px]/[19.6px] font-bold">
            <p className="mb-[4px] flex items-center gap-[6px]">
              <Image src={PhoneBlack} alt="" className="h-[13px] w-[13px]" />
              <span>0305 000 555</span>
            </p>
            <p className="flex items-start gap-[6px]">
              <Image
                src={MarkerBlack}
                alt=""
                className="mt-[1px] h-[13px] w-[15px]"
              />
              <span>56 Nguyễn Huệ, Bến Nghé, Quân 1, HCM</span>
            </p>
          </div>
        </div>
        <div>
          <div className="mb-[12px] flex items-center justify-between">
            <span className="text-[20px]/[24px] font-bold text-[#000]">
              {t('category')}
            </span>
            <CategoryCreation />
          </div>
          <CafeLayout />
        </div>
      </div>
    </main>
  );
}
