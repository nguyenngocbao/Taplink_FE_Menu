'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Spinner } from '@/components/core';
import { GroupImageCard } from '@/components/features';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDisclosure } from '@/hooks';
import { useDelete } from '@/hooks/features';
import { categoryService } from '@/services/category';
import { Option } from '@/types';
import { CategoryDTO } from '@/types/category';
import { StoreDTO } from '@/types/store';

import { CategoryEdit } from '../CategoryEdit';

interface GroupLayout {
  menuTemplates: Option[];
  categories: CategoryDTO[];
  isOwner?: boolean;
  store: StoreDTO;
}

export const GroupLayout: FC<GroupLayout> = ({ categories }) => {
  const [selectedCate, setSelectedCate] = useState(null);
  const { t } = useTranslation('myPage');
  const { isOpen, open, close } = useDisclosure();

  const { deleteItem, isDeleting } = useDelete({ service: categoryService });

  const removeItem = async (id: number) => {
    await deleteItem(id);
  };

  return (
    <>
      <div className="space-y-[36px]">
        <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
          {categories.map(cate => {
            return (
              <Link
                className="w-[calc(50%_-_8px)]"
                href={`${STORE_OWNER_ROUTE.CATEGORY}/${cate.id}/items`}
                key={cate.id}
              >
                <GroupImageCard
                  data={cate}
                  t={t}
                  className="h-full"
                  onEdit={() => {
                    setSelectedCate(cate);
                    open();
                  }}
                  onRemove={async () => {
                    //TODO: show confirm
                    await removeItem(cate.id);
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
      <CategoryEdit isOpen={isOpen} data={selectedCate} close={close} />
      {isDeleting && <Spinner isCenter />}
    </>
  );
};
