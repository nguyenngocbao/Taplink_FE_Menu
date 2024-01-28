'use client';

import {
  Listbox,
  Transition,
  ListboxProps,
  ListboxLabelProps
} from '@headlessui/react';
import React, { Fragment, memo } from 'react';

import { Option } from '@/types';
import { mergeClasses } from '@/utils/common';

const defaultTemplate: React.FC<TemplateProps> = ({ value }) => {
  return <>{value.label}</>;
};

export interface TemplateProps extends ListboxLabelProps<any> {
  value: Option;
  active: boolean;
  selected: boolean;
  disabled: boolean;
  multiple?: boolean;
}

export interface BasicSelectProps
  extends Omit<ListboxProps<any, Option, unknown>, 'value'> {
  value: Option | Option[];
  values: Option[];
  template?: React.FC<TemplateProps>;
  btnClassName?: string;
  ulClassName?: string;
  placeholder?: string;
  prefixIcon?: React.ReactElement;
  suffixIcon?: React.ReactElement;
}

export const Select: React.FC<BasicSelectProps> = memo(
  ({
    template = defaultTemplate,
    value,
    values = [],
    multiple,
    onChange,
    placeholder,
    className,
    btnClassName,
    ulClassName,
    prefixIcon,
    suffixIcon,
    ...props
  }) => {
    const listboxClassName = mergeClasses(
      'text-gray-788 text-[15px]',
      className
    );
    props.className = listboxClassName;

    return (
      <>
        <Listbox
          value={value}
          onChange={onChange}
          multiple={multiple}
          {...props}
        >
          <div className="relative w-full">
            <Listbox.Button
              className={mergeClasses(
                'relative flex h-[45px] w-full cursor-default items-center justify-between rounded-lg bg-white py-2 pl-3 pr-6 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm lg:h-auto',
                btnClassName
              )}
            >
              <span className="flex w-[calc(100%_-_16px)] items-center">
                {prefixIcon && <span className="mr-[11px]">{prefixIcon}</span>}
                <span className="block truncate">
                  {value
                    ? Array.isArray(value)
                      ? value.map(v => v.label).join(', ') || placeholder
                      : value?.label
                    : placeholder}
                </span>
              </span>
              {suffixIcon || (
                <>
                  <svg
                    width="16"
                    height="9"
                    viewBox="0 0 16 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="pointer-events-none absolute inset-y-1/3 right-0 flex h-[12px] w-[18px] items-center pr-2"
                  >
                    <path
                      d="M8 9L0.205769 4.3915e-07L15.7942 1.80194e-06L8 9Z"
                      fill="currentColor"
                    />
                  </svg>
                </>
              )}
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className={mergeClasses(
                  'absolute mt-1 w-full overflow-auto rounded-b-[5px] bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
                  ulClassName
                )}
              >
                {values.map((_value, index) => {
                  const childFn: any = labelProps =>
                    template({ value: _value, ...labelProps, multiple });

                  return (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `text-gray-262 relative flex cursor-pointer select-none ${
                          active ? 'bg-yellow-ffc/50 font-bold' : ''
                        }`
                      }
                      value={_value}
                    >
                      {childFn}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </>
    );
  }
);

Select.displayName = 'Select';
