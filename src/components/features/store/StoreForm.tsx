'use client';

import dynamic from 'next/dynamic';
import { FC, memo, useMemo } from 'react';
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

const Controller = dynamic(
  () => import('react-hook-form').then(m => ({ default: m.Controller })),
  {
    ssr: false
  }
);

interface StoreFormProps {
  data?: StoreDTO;
  isLoading?: boolean;
  isEditable?: boolean;
  onSubmit?: (values: StoreDTO) => void;
  storeTypes: Option[];
  initCityOptions: Option[];
  initWardOptions?: Option[];
  initDistrictOptions?: Option[];
}

export const StoreForm: FC<StoreFormProps> = memo(
  ({
    isLoading,
    isEditable = true,
    data,
    storeTypes,
    initCityOptions,
    initDistrictOptions,
    initWardOptions,
    onSubmit
  }) => {
    const isAdd = data === null;

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
            .number()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          image: z.any(),
          districtId: z
            .number()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          cityId: z
            .number()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          wardId: z
            .number()
            .min(1, t('message.fieldRequired', { ns: 'common' })),
          address: z
            .string()
            .min(1, t('message.fieldRequired', { ns: 'common' }))
        }),
      []
    );

    return data !== undefined ? (
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
                  control={control as any}
                  defaultValue={data?.image}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <UploadImage
                        disabled={!isEditable}
                        placeholder={t('uploadDesc')}
                        src={value}
                        onChange={onChange}
                        aspect={358 / 215}
                      />
                    );
                  }}
                />

                <InputField
                  aria-label="name"
                  error={formState.errors['name']}
                  registration={register('name', { value: data?.name })}
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
                    value: data?.storeTypeId
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
                    options={initCityOptions}
                    label={t('provinceCity')}
                    error={formState.errors?.cityId}
                    disabled={!isEditable}
                    placeholder={t('provinceCityPlaceholder')}
                    registration={register('cityId', {
                      value: data?.cityId ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={districtOptions ?? initDistrictOptions ?? []}
                    isLoading={isLoadingDistrict}
                    label={t('district')}
                    error={formState.errors?.districtId}
                    disabled={!isEditable || !getValues('cityId')}
                    placeholder={t('districtPlaceholder')}
                    registration={register('districtId', {
                      value: data?.districtId ?? ''
                    })}
                  ></SelectField>
                  <SelectField
                    options={wardOptions ?? initWardOptions ?? []}
                    isLoading={isLoadingWard}
                    label={t('ward')}
                    error={formState.errors?.wardId}
                    disabled={!isEditable || !getValues('districtId')}
                    placeholder={t('wardPlaceholder')}
                    registration={register('wardId', {
                      value: data?.wardId ?? ''
                    })}
                  ></SelectField>

                  <InputField
                    error={formState.errors.address}
                    registration={register('address', {
                      value: data?.address
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
