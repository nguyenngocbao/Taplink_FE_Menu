import Image from 'next/image';

import { LangSwicher } from './LangSwitcher';

export const Header = () => {
  return (
    <header className="flex h-[64px] w-screen items-center justify-center bg-blank">
      <Image
        src="/logo.png"
        width={273}
        height={64}
        alt="logo"
        className="h-[32px] w-[137px]"
      />
      <LangSwicher />
    </header>
  );
};
