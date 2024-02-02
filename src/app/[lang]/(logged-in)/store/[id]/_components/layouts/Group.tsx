'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Spinner } from '@/components/core';
import { GroupImageCard } from '@/components/features';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi, useDisclosure } from '@/hooks';
import { categoryService } from '@/services/category';
import { useDispatch } from '@/stores';
import {
  hideConfirmDialog,
  showConfirmDialog
} from '@/stores/slices/confirmDialog';
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

export const GroupLayout: FC<GroupLayout> = ({
  categories,
  store,
  isOwner
}) => {
  const [selectedCate, setSelectedCate] = useState(null);
  const { t } = useTranslation('myPage');
  const dispatch = useDispatch();
  const { isOpen, open, close } = useDisclosure();

  const deleteCategoryApi = useDataApi(categoryService.delete);

  const removeItem = async (id: number) => {
    await deleteCategoryApi.call(id);
  };

  return (
    <>
      <div className="space-y-[36px]">
        <div className="flex flex-wrap gap-x-[16px] gap-y-[27px]">
          {categories.map(cate => {
            return (
              <Link
                className="w-[calc(50%_-_8px)]"
                href={`${STORE_OWNER_ROUTE.STORE}/${store.id}/category/${cate.id}/items`}
                key={cate.id}
              >
                <GroupImageCard
                  data={cate}
                  t={t}
                  className="h-full"
                  onEdit={e => {
                    e.preventDefault();
                    setSelectedCate(cate);
                    open();
                  }}
                  onRemove={async e => {
                    e.preventDefault();
                    dispatch(
                      showConfirmDialog({
                        title: t('label.confirmDelete', { ns: 'common' }),
                        desc: t('confirmDeleteCate'),
                        items: [
                          {
                            label: t('category'),
                            value: cate.name
                          },
                          {
                            label: t('desc'),
                            value: cate.description
                          }
                        ],
                        action: 'delete',
                        submitBtnText: t('label.submit', { ns: 'common' }),
                        async callback() {
                          await removeItem(cate.id);
                          dispatch(hideConfirmDialog());
                        }
                      })
                    );
                  }}
                />
              </Link>
            );
          })}
        </div>
      </div>
      {isOwner && (
        <CategoryEdit isOpen={isOpen} data={selectedCate} close={close} />
      )}
      {deleteCategoryApi.isLoading && <Spinner isCenter />}
    </>
  );
};
