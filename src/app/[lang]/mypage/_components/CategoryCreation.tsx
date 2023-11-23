'use client';

import Image from 'next/image';
import { useCallback, useMemo } from 'react';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import {
  Button,
  Dialog,
  Form,
  InputField,
  TextAreaField
} from '@/components/Elements';
import { useDisclosure } from '@/hooks/useDisclosure';
import { StoreCategoryResquest } from '@/types/store';

import PlusBlack from '../_assets/plus-black.svg';

export const CategoryCreation = () => {
  const { isOpen, open, close } = useDisclosure();
  const { t } = useTranslation('myPage');

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
        desc: z.string().min(1, t('message.fieldRequired', { ns: 'common' }))
      }),
    []
  );
  const onSubmit = useCallback(async (value: StoreCategoryResquest) => {
    console.log(value);
    // toast.success('追加しました');
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
        <Form<StoreCategoryResquest, typeof schema>
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
                  error={formState.errors['desc']}
                  registration={register('desc', { value: '' })}
                  label={t('desc')}
                  placeholder={t('descPlaceholder')}
                />

                <Button className="w-full">{t('save')}</Button>
              </>
            );
          }}
        </Form>
      </Dialog>
    </>
  );
};
