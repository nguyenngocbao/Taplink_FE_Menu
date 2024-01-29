'use client';

import { FC, memo, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import {
  Button,
  Form,
  InputField,
  TextAreaField,
  UploadImage
} from '@/components/core';
import { CategoryDTO } from '@/types/category';

interface CategoryFormProps {
  data?: CategoryDTO;
  isLoading?: boolean;
  onSubmit?: (values: CategoryDTO) => void;
}

export const CategoryForm: FC<CategoryFormProps> = memo(
  ({ data, isLoading, onSubmit }) => {
    const { t } = useTranslation('myPage');

    const schema = useMemo(
      () =>
        z.object({
          name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          description: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          image: z.any()
        }),
      []
    );

    return (
      <Form<CategoryDTO, typeof schema>
        onSubmit={onSubmit}
        schema={schema}
        className="w-full text-left"
      >
        {({ register, control, formState }) => {
          return (
            <>
              <Controller
                name="image"
                defaultValue={data?.image}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <UploadImage
                      placeholder={t('uploadImageCateDesc')}
                      src={value}
                      onChange={onChange}
                      aspect={163 / 195}
                    />
                  );
                }}
              />

              <InputField
                aria-label="name"
                error={formState.errors['name']}
                registration={register('name', { value: data?.name })}
                label={t('category')}
                placeholder={t('categoryPlaceholder')}
              />

              <TextAreaField
                aria-label="desc"
                error={formState.errors['description']}
                registration={register('description', {
                  value: data?.description
                })}
                label={t('desc')}
                placeholder={t('descPlaceholder')}
              />

              <Button
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {t('save')}
              </Button>
            </>
          );
        }}
      </Form>
    );
  }
);
