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
} from '@/components/core';
import { useDataApi } from '@/hooks';
import { addressService } from '@/services/address';
import { Option } from '@/types';
import { StoreDTO } from '@/types/store';

interface StoreFormProps {
  data?: StoreDTO;
  isLoading?: boolean;
  isEditable?: boolean;
  onSubmit?: (values: StoreDTO) => void;
  storeTypes: Option[];
  cityOptions: Option[];
}

const StoreForm: FC<StoreFormProps> = memo(
  ({
    isLoading,
    isEditable = true,
    data: userInfo,
    storeTypes,
    cityOptions,
    onSubmit
  }) => {
    const isAdd = userInfo === null;

    const {
      data: districtOptions,
      isLoading: isLoadingDistrict,
      call: getDistrictOptions
    } = useDataApi<Option[]>(addressService.getDistricts.bind(addressService));

    const {
      data: wardOptions,
      isLoading: isLoadingWard,
      call: getWardOptions
    } = useDataApi<Option[]>(addressService.getWards.bind(addressService));

    const { t } = useTranslation(['createStore', 'common']);

    const schema = useMemo(
      () =>
        z.object({
          name: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
          storeTypeId: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          image: z.any(),
          // nation: z
          //   .string()
          //   .min(1, t('message.fieldRequired', { ns: 'common' })),
          districtId: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          cityId: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          wardId: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          address: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' }))
        }),
      []
    );

    return userInfo !== undefined ? (
      <div>
        <Form<StoreDTO, typeof schema>
          onSubmit={onSubmit}
          schema={schema}
          onChangeValue={async (value, name, type, methods) => {
            if (name === 'cityId') {
              await getDistrictOptions(value[name]);
              methods.trigger('cityId');
            }
            if (name === 'districtId') {
              await getWardOptions(value[name]);
              methods.trigger('districtId');
            }
          }}
        >
          {({ register, control, formState, getValues }) => {
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
                  error={formState.errors?.storeTypeId}
                  disabled={!isEditable}
                  placeholder={t('storeTypePlaceholder')}
                  registration={register('storeTypeId', {
                    value: userInfo?.storeTypeId ?? ''
                  })}
                ></SelectField>

                <div className="h-[1px] w-full bg-disabled"></div>

                <div className="space-y-[24px]">
                  <h2 className="text-[20px]/[24px] font-bold text-primary">
                    {t('storeAddress')}
                  </h2>
                  {/* Temperary hide */}
                  {/* <SelectField
                    options={storeTypes}
                    label={t('nation')}
                    error={formState.errors.address?.['nation']}
                    disabled={!isEditable}
                    placeholder={t('nationPlaceholder')}
                    registration={register('address.nation', {
                      value: userInfo?.type ?? ''
                    })}
                  ></SelectField> */}
                  <SelectField
                    options={cityOptions}
                    label={t('provinceCity')}
                    error={formState.errors?.cityId}
                    disabled={!isEditable}
                    placeholder={t('provinceCityPlaceholder')}
                    registration={register('cityId', {
                      value: userInfo?.cityId ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={districtOptions ?? []}
                    isLoading={isLoadingDistrict}
                    label={t('district')}
                    error={formState.errors?.districtId}
                    disabled={!isEditable || !getValues('cityId')}
                    placeholder={t('districtPlaceholder')}
                    registration={register('districtId', {
                      value: userInfo?.districtId ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={wardOptions ?? []}
                    isLoading={isLoadingWard}
                    label={t('ward')}
                    error={formState.errors?.wardId}
                    disabled={!isEditable || !getValues('districtId')}
                    placeholder={t('wardPlaceholder')}
                    registration={register('wardId', {
                      value: userInfo?.wardId ?? ''
                    })}
                  ></SelectField>

                  <InputField
                    error={formState.errors.address}
                    registration={register('address', {
                      value: userInfo?.address
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
