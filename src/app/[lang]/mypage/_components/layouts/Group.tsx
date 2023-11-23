'use client';

import { useTranslation } from '@/app/i18n/client';

import { GroupImageCard } from '../Cards/GroupImageCard';

export const GroupLayout = () => {
  const { t } = useTranslation('myPage');

  return (
    <>
      <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
        <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
        <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
        <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
        <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
        <GroupImageCard t={t} className="w-[calc(50%_-_8px)]" />
      </div>
    </>
  );
};
