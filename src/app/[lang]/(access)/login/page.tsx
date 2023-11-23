import Image from 'next/image';

import ThreeDLogin from '@/assets/image/3d-login.png';

import { LoginAction } from './_components/LoginAction';

export default async function () {
  return (
    <main className="flex flex-col items-center px-[16px] py-[54px] text-center">
      <Image className="mb-[19px] w-[202px]" src={ThreeDLogin} alt="login" />
      <LoginAction />
    </main>
  );
}
