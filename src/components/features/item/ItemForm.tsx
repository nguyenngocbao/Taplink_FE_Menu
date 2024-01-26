'use client';

import { FC, memo, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import {
  Button,
  Form,
  InputField,
  SelectField,
  TextAreaField,
  UploadImage
} from '@/components/core';
import { PRICE_SIZE_TYPES } from '@/constants/item';
import { Option } from '@/types';
import { CategoryDTO } from '@/types/category';
import { ItemDTO, PriceType } from '@/types/item';

interface UserAddProps {
  data?: ItemDTO;
  isLoading?: boolean;
  isEditable?: boolean;
  onSubmit?: (values: ItemDTO) => void;
  categories: CategoryDTO[];
  priceTypes: Option[];
  imageAspect?: number;
}

export const ItemForm: FC<UserAddProps> = memo(
  ({
    data,
    isLoading,
    isEditable = true,
    categories,
    priceTypes,
    imageAspect,
    onSubmit
  }) => {
    const isAdd = data === null;
    const { t } = useTranslation(['myPage', 'common']);

    const schema = useMemo(
      () =>
        z.object({
          name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          priceTypeId: z.any(),
          categoryId: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          image: z.any(),
          prices: z.any(),
          description: z.any(),
          priceInfo: z.any()
        }),
      []
    );

    return data !== undefined ? (
      <div>
        <Form<ItemDTO, typeof schema>
          onSubmit={d => onSubmit({ ...data, ...d })}
          schema={schema}
        >
          {({ register, control, formState, watch }) => {
            const priceType = Number(watch('priceTypeId'));
            const priceRender = (() => {
              switch (priceType) {
                case PriceType.Single:
                  return (
                    <InputField
                      error={formState.errors['priceInfo.price']}
                      registration={register('priceInfo.price', {
                        value: data?.priceInfo.price
                      })}
                      label={t('price')}
                      placeholder={t('pricePlaceholder')}
                      disabled={!isEditable}
                      validation={{
                        numberHalfWidth: true
                      }}
                      type="number"
                    />
                  );
                case PriceType.Range:
                  return (
                    <>
                      <InputField
                        error={formState.errors['priceInfo.price.0']}
                        registration={register('priceInfo.price.0', {
                          value: data?.priceInfo.price[0]
                        })}
                        label={t('priceFrom')}
                        placeholder={t('pricePlaceholder')}
                        disabled={!isEditable}
                        validation={{
                          numberHalfWidth: true
                        }}
                        type="number"
                      />
                      <InputField
                        error={formState.errors['priceInfo.price.1']}
                        registration={register('priceInfo.price.1', {
                          value: data?.priceInfo.price[1]
                        })}
                        label={t('priceTo')}
                        placeholder={t('pricePlaceholder')}
                        disabled={!isEditable}
                        validation={{
                          numberHalfWidth: true
                        }}
                        type="number"
                      />
                    </>
                  );
                case PriceType.Size:
                  return PRICE_SIZE_TYPES.map(type => {
                    return (
                      <InputField
                        key={String(type.value)}
                        error={
                          formState.errors[`priceInfo.price.${type.value}`]
                        }
                        registration={register(
                          `priceInfo.price.${type.value}` as any,
                          {
                            value: data?.priceInfo.price[type.value]
                          }
                        )}
                        label={`${t('priceForSize')} ${type.label}`}
                        placeholder={t('pricePlaceholder')}
                        disabled={!isEditable}
                        validation={{
                          numberHalfWidth: true
                        }}
                        type="number"
                      />
                    );
                  });
              }
            })();

            return (
              <>
                {imageAspect && (
                  <Controller
                    name="image"
                    defaultValue={data?.image}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <UploadImage
                          disabled={!isEditable}
                          placeholder={t('uploadImageDesc')}
                          src={value}
                          onChange={onChange}
                          aspect={imageAspect}
                        />
                      );
                    }}
                  />
                )}

                <InputField
                  aria-label="name"
                  error={formState.errors['name']}
                  registration={register('name', { value: data?.name })}
                  label={t('itemName')}
                  placeholder={t('itemNamePlaceholder')}
                  disabled={!isEditable}
                />

                <SelectField
                  options={categories.map(c => ({
                    label: c.name,
                    value: c.id
                  }))}
                  label={t('itemType')}
                  error={formState.errors['categoryId']}
                  disabled={!isEditable}
                  placeholder={t('itemTypePlaceholder')}
                  registration={register('categoryId', {
                    value: data?.categoryId ?? ''
                  })}
                ></SelectField>

                <SelectField
                  options={priceTypes}
                  label={t('priceType')}
                  error={formState.errors['priceTypeId']}
                  disabled={!isEditable}
                  placeholder={t('priceTypePlaceholder')}
                  registration={register('priceTypeId', {
                    value: data?.priceTypeId
                  })}
                ></SelectField>

                {priceRender}

                <TextAreaField
                  aria-label="description"
                  error={formState.errors['description']}
                  registration={register('description', {
                    value: data?.description
                  })}
                  label={t('desc')}
                  placeholder={t('descPlaceholder')}
                  disabled={!isEditable}
                />

                {isEditable && (
                  <Button
                    disabled={isLoading}
                    isLoading={isLoading}
                    type="submit"
                    className="w-full"
                  >
                    {isAdd ? t('createItem') : t('updateItem')}
                  </Button>
                )}
              </>
            );
          }}
        </Form>
      </div>
    ) : (
      <p>{t('loading', { ns: 'common' })}...</p>
    );
  }
);
