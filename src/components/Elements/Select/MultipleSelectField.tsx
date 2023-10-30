import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/react/24/solid';
import * as React from 'react';

import {
  FieldWrapper,
  FieldWrapperPassThroughProps
} from '@/components/Elements/FieldWrapper';
import { Option } from '@/types';
import { mergeClasses } from '@/utils/common';

type MultipleSelectFieldProps = {
  options: Option[];
  isLoading?: boolean;
  className?: string;
  containerClassNameLv2?: string;
  containerClassNameLv1?: string;
  containerClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string[]) => void;
  value: string[];
  readOnly?: boolean;
} & FieldWrapperPassThroughProps;

export const MultipleSelectField: React.FC<MultipleSelectFieldProps> = ({
  label,
  options,
  error,
  disabled,
  isLoading,
  className,
  containerClassName,
  containerClassNameLv1,
  containerClassNameLv2,
  labelClassName,
  defaultValue,
  placeholder,
  isRequired,
  onChange,
  value = [],
  readOnly,
  tooltip
}) => {
  const [currentValue, setCurrentValue] = React.useState<string[]>(
    value.length === 0 ? [''] : value
  );

  return (
    <FieldWrapper
      isRequired={isRequired}
      label={label}
      error={error}
      className={labelClassName}
      tooltip={tooltip}
    >
      <div
        className={mergeClasses('flex flex-col gap-[4px]', containerClassName)}
      >
        {currentValue.map((cur, idx) => {
          const isLastItem = idx === currentValue.length - 1;
          const maxNumberOfSelect = currentValue.length === options?.length;

          return (
            <div
              key={idx}
              className={mergeClasses(
                'flex w-full items-center',
                containerClassNameLv1
              )}
            >
              <div
                className={mergeClasses(
                  'relative h-[40px] w-full rounded-[4px]',
                  isLoading ? 'animate-pulse bg-slate-200' : '',
                  containerClassNameLv2
                )}
              >
                <div className="w-full">
                  {!isLoading && (
                    <>
                      <select
                        disabled={disabled || readOnly}
                        placeholder={placeholder}
                        style={{ ...(readOnly && { opacity: 1 }) }}
                        name="location"
                        className={mergeClasses(
                          'border-silver-sand text-black-700 block h-full w-full appearance-none rounded-[4px] border bg-white py-2 pl-3 pr-[40px] text-[14px] leading-[20px]',
                          className,
                          disabled && 'disabled:bg-black-200'
                        )}
                        value={cur}
                        defaultValue={defaultValue}
                        onChange={e => {
                          setCurrentValue(pre => {
                            onChange &&
                              onChange([
                                ...value.filter(v => v !== pre[idx]),
                                e.target.value
                              ]);

                            pre[idx] = e.target.value;

                            return [...pre];
                          });
                        }}
                      >
                        {placeholder && (
                          <option disabled value="">
                            {placeholder}
                          </option>
                        )}
                        {options.map(({ label: name, value: id }) => (
                          <option
                            disabled={value.includes(String(id))}
                            key={name?.toString()}
                            value={id}
                          >
                            {name}
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
              {!readOnly && (
                <button
                  onClick={() => {
                    if (isLastItem && !maxNumberOfSelect) {
                      setCurrentValue(pre => [...pre, '']);
                    } else {
                      setCurrentValue(pre => {
                        const newVal = pre.filter(v => v !== cur && v !== '');

                        onChange && onChange(newVal.length > 0 ? newVal : ['']);

                        return newVal.length > 0 ? newVal : [''];
                      });
                    }
                  }}
                  disabled={isLoading}
                  type="button"
                  className={mergeClasses(
                    'bg-black-200 hover:bg-black-300 ml-[8px] flex  h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full',
                    isLoading
                      ? 'animate-pulse border border-slate-300/30 bg-slate-200'
                      : ''
                  )}
                >
                  {!isLoading &&
                    (isLastItem && !maxNumberOfSelect ? (
                      <PlusIcon
                        aria-hidden="true"
                        className="text-black-900 h-[20px] w-[20px]"
                      />
                    ) : (
                      <MinusIcon
                        aria-hidden="true"
                        className="text-black-900 h-[20px] w-[20px]"
                      />
                    ))}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </FieldWrapper>
  );
};
