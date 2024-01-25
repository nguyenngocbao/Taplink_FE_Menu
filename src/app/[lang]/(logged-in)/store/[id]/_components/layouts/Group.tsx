'use client';

import { FC } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { GroupImageCard } from '@/components/features';
import { CategoryDTO } from '@/types/category';

interface GroupLayout {
  categories: CategoryDTO[];
  isOwner?: boolean;
}

export const GroupLayout: FC<GroupLayout> = ({ categories, isOwner }) => {
  const { t } = useTranslation('myPage');
  console.log(categories, isOwner);
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
