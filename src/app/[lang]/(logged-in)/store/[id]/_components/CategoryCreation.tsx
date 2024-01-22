'use client';

import Image from 'next/image';
import { FC, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import PlusBlack from '@/assets/icon/plus-black.svg';
import {
  Button,
  Dialog,
  Form,
  InputField,
  TextAreaField
} from '@/components/core';
import { useDataApi, useDisclosure } from '@/hooks';
import { categoryService } from '@/services/category';
import { StoreCategoryPostReq } from '@/types/store';

interface CategoryCreation {
  storeId: string;
}

export const CategoryCreation: FC<CategoryCreation> = ({ storeId }) => {
  const { isOpen, open, close } = useDisclosure();
  const { t } = useTranslation('myPage');
  const addCategoryApi = useDataApi(
    categoryService.create.bind(categoryService)
  );

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
        description: z
          .string()
          .min(1, t('message.fieldRequired', { ns: 'common' }))
      }),
    []
  );

  const onSubmit = useCallback(async (value: StoreCategoryPostReq) => {
    await addCategoryApi.call({
      ...value,
      storeId: Number(storeId)
    });
    close();
    toast.success('追加しました');
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
        <Form<StoreCategoryPostReq, typeof schema>
          onSubmit={onSubmit}
          schema={schema}
          className="w-[calc(100vw_-_64px)] text-left"
        >
          {({ register, formState }) => {
            return (
              <>
                <InputField
                  aria-label="name"
                  error={formState.errors['name']}
                  registration={register('name', { value: '' })}
                  label={t('category')}
                  placeholder={t('categoryPlaceholder')}
                />

                <TextAreaField
                  aria-label="desc"
                  error={formState.errors['description']}
                  registration={register('description', { value: '' })}
                  label={t('desc')}
                  placeholder={t('descPlaceholder')}
                />

                <Button
                  isLoading={addCategoryApi.isLoading}
                  disabled={addCategoryApi.isLoading}
                  className="w-full"
                >
                  {t('save')}
                </Button>
              </>
            );
          }}
        </Form>
      </Dialog>
    </>
  );
};
