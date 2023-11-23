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
import { StoreRequest } from '@/types/store';

interface UserAddProps {
  userInfo?: StoreRequest;
  isLoading?: boolean;
  isEditable?: boolean;
  onSubmit?: (values: StoreRequest) => void;
  storeTypes: Option[];
}

const StoreForm: FC<UserAddProps> = memo(
  ({ isLoading, isEditable = true, userInfo, storeTypes, onSubmit }) => {
    const isAdd = userInfo === null;
    const { t } = useTranslation(['createStore', 'common']);

    const schema = useMemo(
      () =>
        z.object({
          name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          type: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          phoneNumber: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          email: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' }))
            .email(t('message.emailInvalid', { ns: 'common' })),
          image: z.any(),
          address: z.object({
            nation: z
              .string()
              .min(1, t('message.fieldRequired', { ns: 'common' })),
            district: z
              .string()
              .min(1, t('message.fieldRequired', { ns: 'common' })),
            city: z
              .string()
              .min(1, t('message.fieldRequired', { ns: 'common' })),
            ward: z
              .string()
              .min(1, t('message.fieldRequired', { ns: 'common' })),
            detail: z
              .string()
              .min(1, t('message.fieldRequired', { ns: 'common' }))
          })
        }),
      []
    );

    return userInfo !== undefined ? (
      <div>
        <Form<StoreRequest, typeof schema> onSubmit={onSubmit} schema={schema}>
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
                        placeholder={t('uploadDesc')}
                        src={value}
                        onChange={onChange}
                      />
                    );
                  }}
                />

                <InputField
                  aria-label="name"
                  error={formState.errors['name']}
                  registration={register('name', { value: userInfo?.name })}
                  label={t('storeName')}
                  placeholder={t('storeNamePlaceholder')}
                  disabled={!isEditable}
                />

                <SelectField
                  options={storeTypes}
                  label={t('storeType')}
                  error={formState.errors['type']}
                  disabled={!isEditable}
                  placeholder={t('storeTypePlaceholder')}
                  registration={register('type', {
                    value: userInfo?.type ?? ''
                  })}
                ></SelectField>

                <InputField
                  type="phone"
                  aria-label="phone"
                  error={formState.errors['phoneNumber']}
                  registration={register('phoneNumber', {
                    value: userInfo?.phoneNumber
                  })}
                  label={t('storePhone')}
                  placeholder={t('storePhonePlaceholder')}
                  disabled={!isEditable}
                />

                <InputField
                  type="email"
                  aria-label="email"
                  error={formState.errors['email']}
                  registration={register('email', { value: userInfo?.email })}
                  label={t('storeEmail')}
                  placeholder={t('storeEmailPlaceholder')}
                  disabled={!isEditable}
                />

                <div className="h-[1px] w-full bg-disabled"></div>

                <div className="space-y-[24px]">
                  <h2 className="text-[20px]/[24px] font-bold text-primary">
                    {t('storeAddress')}
                  </h2>
                  <SelectField
                    options={storeTypes}
                    label={t('nation')}
                    error={formState.errors.address?.['nation']}
                    disabled={!isEditable}
                    placeholder={t('nationPlaceholder')}
                    registration={register('address.nation', {
                      value: userInfo?.type ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={storeTypes}
                    label={t('provinceCity')}
                    error={formState.errors.address?.['city']}
                    disabled={!isEditable}
                    placeholder={t('provinceCityPlaceholder')}
                    registration={register('address.city', {
                      value: userInfo?.address.city ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={storeTypes}
                    label={t('district')}
                    error={formState.errors.address?.['district']}
                    disabled={!isEditable}
                    placeholder={t('districtPlaceholder')}
                    registration={register('address.district', {
                      value: userInfo?.address.district ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={storeTypes}
                    label={t('ward')}
                    error={formState.errors.address?.['ward']}
                    disabled={!isEditable}
                    placeholder={t('wardPlaceholder')}
                    registration={register('address.ward', {
                      value: userInfo?.address.ward ?? ''
                    })}
                  ></SelectField>

                  <InputField
                    error={formState.errors.address?.['detail']}
                    registration={register('address.detail', {
                      value: userInfo?.address.detail
                    })}
                    label={t('detailAddress')}
                    placeholder={t('detailAddressPlaceholder')}
                    disabled={!isEditable}
                  />
                </div>

                {isEditable && (
                  <Button
                    disabled={isLoading}
                    isLoading={isLoading}
                    type="submit"
                    className="w-full"
                  >
                    {isAdd ? t('createStore') : t('updateStore')}
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

export default StoreForm;
