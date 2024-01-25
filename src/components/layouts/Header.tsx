import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

import LogoImage from '@/assets/image/logo.png';

import { LangSwicher } from './LangSwitcher';
import { SignOutButton } from './SignOutButton';

export const Header = () => {
  return (
    <header className="flex h-[64px] w-screen items-center justify-center bg-blank">
      <SignOutButton className="absolute left-0 flex h-[56px] w-[56px] items-center justify-center bg-transparent text-primary">
        <ArrowLeftOnRectangleIcon className="h-[24px] w-[24px]" />
      </SignOutButton>
      <Link href="/">
        <Image
          src={LogoImage}
          width={273}
          height={64}
          alt="logo"
          className="h-[32px] w-[137px]"
        />
      </Link>
      <LangSwicher />
    </header>
  );
};
