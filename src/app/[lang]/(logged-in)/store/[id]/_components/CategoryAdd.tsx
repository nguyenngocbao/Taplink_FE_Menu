'use client';

import Image from 'next/image';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import PlusBlack from '@/assets/icon/plus-black.svg';
import { Dialog } from '@/components/core';
import { CategoryForm } from '@/components/features';
import { useDisclosure } from '@/hooks';
import { useCreate } from '@/hooks/features';
import { categoryService } from '@/services/category';
import { CategoryDTO } from '@/types/category';
import { dataURLtoFile } from '@/utils/common';

interface CategoryAdd {
  storeId: string;
}

export const CategoryAdd: FC<CategoryAdd> = ({ storeId }) => {
  const { isOpen, open, close } = useDisclosure();
  const { t } = useTranslation('myPage');

  const { createItem, isCreating } = useCreate({ service: categoryService });

  const onSubmit = useCallback(async (value: CategoryDTO) => {
    await createItem(
      {
        name: value.name,
        description: value.description,
        ...(value?.image && {
          image: dataURLtoFile(value.image, 'image.png')
        }),
        storeId: Number(storeId)
      },
      true,
      {
        'content-type': 'multipart/form-data'
      }
    );
    close();
    toast.success(t('createCateSuccess'));
  }, []);

  return (
    <>
      <button
        onClick={open}
        className="flex items-center gap-[6px] rounded-[4px] px-1"
      >
        <Image src={PlusBlack} alt="" />
        <span className="text-[12px]/[16.8px] font-[600]">
          {t('addCategory')}
        </span>
      </button>
      <Dialog title={t('addCategory')} isOpen={isOpen} onClose={close}>
        <CategoryForm isLoading={isCreating} onSubmit={onSubmit} />
      </Dialog>
    </>
  );
};
