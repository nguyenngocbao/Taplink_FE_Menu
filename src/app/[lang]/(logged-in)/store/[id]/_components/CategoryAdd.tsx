'use client';

import Image from 'next/image';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import PlusBlack from '@/assets/icon/plus-black.svg';
import { Dialog } from '@/components/core';
import { CategoryForm } from '@/components/features';
import { useDataApi, useDisclosure } from '@/hooks';
import { categoryService } from '@/services/category';
import { CategoryDTO } from '@/types/category';
import { dataURLtoFile, getCompressedImage } from '@/utils/common';

interface CategoryAdd {
  storeId: string;
}

export const CategoryAdd: FC<CategoryAdd> = ({ storeId }) => {
  const { isOpen, open, close } = useDisclosure();
  const { t } = useTranslation('myPage');

  const createCategoryApi = useDataApi(categoryService.create);
  const compressImgApi = useDataApi(getCompressedImage);

  const onSubmit = useCallback(async (value: CategoryDTO) => {
    await createCategoryApi.call(
      {
        name: value.name,
        description: value.description,
        ...(value?.image && {
          image: await compressImgApi.call(
            dataURLtoFile(value.image, 'image.png')
          )
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
        <div className="no-scrollbar h-[calc(100vh_-_140px)] w-[calc(100vw_-_64px)] overflow-y-auto px-[2px] text-left">
          <CategoryForm
            isLoading={createCategoryApi.isLoading || compressImgApi.isLoading}
            onSubmit={onSubmit}
          />
        </div>
      </Dialog>
    </>
  );
};
