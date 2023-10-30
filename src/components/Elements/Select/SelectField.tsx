import { ChevronDownIcon } from '@heroicons/react/24/solid';
import * as React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { mergeClasses } from '@/utils/common';

import { FieldWrapper, FieldWrapperPassThroughProps } from '../FieldWrapper';

type Option = {
  label: React.ReactNode;
  value: string | number | string[];
};

type SelectFieldProps = FieldWrapperPassThroughProps & {
  options: Option[];
  isLoading?: boolean;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  registration?: Partial<UseFormRegisterReturn>;
  onChange?: (value: string) => void;
  value?: string;
  readOnly?: boolean;
};

export const SelectField = (props: SelectFieldProps) => {
  const {
    label,
    options,
    error,
    disabled,
    isLoading,
    className,
    containerClassName,
    labelClassName,
    defaultValue,
    registration,
    placeholder,
    isRequired,
    onChange,
    value,
    readOnly,
    tooltip
  } = props;

  return (
    <FieldWrapper
      isRequired={isRequired}
      label={label}
      error={error}
      className={labelClassName}
      tooltip={tooltip}
    >
      <div
        className={mergeClasses(
          'relative h-[40px] rounded-[4px]',
          isLoading ? 'animate-pulse bg-slate-200' : '',
          containerClassName
        )}
      >
        <div className="h-full">
          {!isLoading && (
            <>
              <select
                disabled={disabled || readOnly}
                placeholder={placeholder}
                name="location"
                style={{ ...(readOnly && { opacity: 1 }) }}
                className={mergeClasses(
                  'border-silver-sand text-black-700 block h-full w-full appearance-none rounded-[4px] border bg-white py-2 pl-3 pr-[40px] text-[14px] leading-[20px]',
                  label && 'mt-1',
                  className,
                  disabled && 'disabled:bg-black-200'
                )}
                defaultValue={defaultValue}
                onChange={e => onChange && onChange(e.target.value)}
                {...(value && { value: value })}
                {...registration}
              >
                {placeholder && (
                  <option disabled value="">
                    {placeholder}
                  </option>
                )}
                {options.map(({ label, value }) => (
                  <option key={String(value)} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {!readOnly && !disabled && (
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className="block h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </FieldWrapper>
  );
};
