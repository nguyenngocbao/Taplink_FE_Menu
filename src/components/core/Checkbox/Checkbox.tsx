import React, { FC, memo, useMemo } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { SIZE } from '@/types';
import { mergeClasses } from '@/utils/common';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelDirection?: 'left' | 'right';
  registration?: Partial<UseFormRegisterReturn>;
  checkboxSize?: SIZE;
  labelClassName?: string;
}

export const Checkbox: FC<CheckboxProps> = memo(
  ({
    label,
    labelDirection = 'left',
    id,
    registration,
    checkboxSize,
    className,
    labelClassName,
    ...props
  }) => {
    const checkboxClassBySide = useMemo(() => {
      switch (checkboxSize) {
        case 'lg':
          return 'w-5 h-5 before:w-full before:bg-center before:h-full before:bg-no-repeat checked:before:bg-[url(/icons/check-large.svg)] rounded-[4px] border-2';
        case 'md':
          return 'w-4 h-4 before:w-full before:bg-center before:h-full before:bg-no-repeat checked:before:bg-[url(/icons/check-medium.svg)] rounded-[4px] border-2';
        case 'sm':
          return 'w-3 h-3 before:w-full before:bg-center before:h-full before:bg-no-repeat checked:before:bg-[url(/icons/check-small.svg)] rounded-[2px] border-[1px]';
        default:
          return '';
      }
    }, [checkboxSize]);
    return (
      <label
        htmlFor={id}
        className={mergeClasses(
          'text-granite-gray inline-flex cursor-pointer items-center text-[10px]',
          labelClassName
        )}
      >
        {labelDirection === 'left' && label}
        <input
          id={id}
          type="checkbox"
          className={mergeClasses(
            'border-silver-sand checked:border-red checked:bg-red checked:hover:border-red relative inline-flex cursor-pointer appearance-none items-center bg-white before:absolute',
            checkboxClassBySide,
            !props.disabled && 'hover:border-ultra-red-light',
            className
          )}
          {...registration}
          {...props}
        />
        {labelDirection === 'right' && (
          <span className="ml-[8px]">{label}</span>
        )}
      </label>
    );
  }
);
