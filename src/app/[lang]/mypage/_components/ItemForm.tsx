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
  UploadImage
} from '@/components/Elements';
import { Option } from '@/types';
import { ItemRequest } from '@/types/item';

interface UserAddProps {
  data?: ItemRequest;
  isLoading?: boolean;
  isEditable?: boolean;
  onSubmit?: (values: ItemRequest) => void;
  itemTypes: Option[];
}

const ItemForm: FC<UserAddProps> = memo(
  ({ isLoading, isEditable = true, data, itemTypes, onSubmit }) => {
    const isAdd = data === null;
    const { t } = useTranslation(['myPage', 'common']);

    const schema = useMemo(
      () =>
        z.object({
          name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          priceType: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          type: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          phoneNumber: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          email: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' }))
            .email(t('message.emailInvalid', { ns: 'common' })),
          image: z.any(),
          prices: z.any()
        }),
      []
    );

    return data !== undefined ? (
      <div>
        <Form<ItemRequest, typeof schema> onSubmit={onSubmit} schema={schema}>
          {({ register, control, formState }) => {
            return (
              <>
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <UploadImage
                        disabled={!isEditable}
                        placeholder={t('uploadImageDesc')}
                        src={value}
                        onChange={onChange}
                      />
                    );
                  }}
                />
                <InputField
                  aria-label="name"
                  error={formState.errors['name']}
                  registration={register('name', { value: data?.name })}
                  label={t('itemName')}
                  placeholder={t('itemNamePlaceholder')}
                  disabled={!isEditable}
                />
                <SelectField
                  options={itemTypes}
                  label={t('itemType')}
                  error={formState.errors['category']}
                  disabled={!isEditable}
                  placeholder={t('itemTypePlaceholder')}
                  registration={register('category', {
                    value: data?.category ?? ''
                  })}
                ></SelectField>
                <SelectField
                  options={itemTypes}
                  label={t('priceType')}
                  error={formState.errors['priceType']}
                  disabled={!isEditable}
                  placeholder={t('priceTypePlaceholder')}
                  registration={register('priceType', {
                    value: data?.priceType ?? ''
                  })}
                ></SelectField>

                {/* TODO */}
                <InputField
                  error={formState.errors['prices[0]']}
                  registration={register('prices', {
                    value: data?.prices
                  })}
                  label={t('price')}
                  placeholder={t('pricePlaceholder')}
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

export default ItemForm;
