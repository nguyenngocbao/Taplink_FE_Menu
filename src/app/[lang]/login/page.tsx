import Image from 'next/image';

import { useTranslation } from '@/app/i18n';

import ThreeDLogin from './_assets/3d-login.png';
import { LoginAction } from './_components/LoginAction';

export default async function ({ params: { lang } }) {
  const { t } = await useTranslation(lang, 'login');
  return (
    <main className="flex flex-col items-center px-[16px] py-[54px] text-center">
      <Image className="mb-[19px] w-[202px]" src={ThreeDLogin} alt="login" />
      <div className="mb-[36px]">
        <p className="mb-[8px] text-[20px]/[24px] font-bold">
          {t('enterOTPOnTime')}
        </p>
        <p> {t('enterOTPDesc')}</p>
      </div>
      <LoginAction />
    </main>
  );
}
