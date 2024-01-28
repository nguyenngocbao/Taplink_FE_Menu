'use client';

import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Chip } from '@/components/core';
import { useItem } from '@/hooks/features/use-item';
import { Option } from '@/types';
import { CategoryDTO } from '@/types/category';
import { StoreDTO } from '@/types/store';
import { updateUrlWithParams } from '@/utils/common';

interface BasicLayout {
  categories: CategoryDTO[];
  menuTemplates: Option[];
  store: StoreDTO;
  priceTypes: Option[];
  isOwner?: boolean;
}

export const BasicLayout: FC<BasicLayout> = ({
  store,
  categories,
  menuTemplates,
  priceTypes,
  isOwner
}) => {
  const query = useSearchParams();
  const { t } = useTranslation(['myPage', 'common']);
  const categoryId = Number(query.get('categoryId') ?? categories[0]?.id);

  const {
    getListItem,
    itemsRender,
    addItemDialogRender,
    changeTemplateRender
  } = useItem({
    t,
    store,
    categoryId,
    isEditable: isOwner,
    categories,
    priceTypes,
    menuTemplates
  });

  return (
    <>
      <div className="space-y-[36px]">
        <div className="no-scrollbar mr-[-16px] flex gap-[8px] overflow-x-auto">
          {categories?.map(cate => {
            return (
              <Chip
                onClick={() => {
                  updateUrlWithParams({ categoryId: cate.id });
                  getListItem({ categoryId: cate.id });
                }}
                isActive={categoryId === cate.id}
                key={String(cate.id)}
              >
                {cate.name}
              </Chip>
            );
          })}
        </div>

        {changeTemplateRender}

        {itemsRender}

        {addItemDialogRender}
      </div>
    </>
  );
};
