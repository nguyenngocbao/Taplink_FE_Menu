import React, { FC, useMemo } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { SIZE } from '@/types';
import { mergeClasses } from '@/utils/common';

interface RadioButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  registration?: Partial<UseFormRegisterReturn>;
  radioButtonSize?: SIZE;
}

export const RadioButton: FC<RadioButtonProps> = ({
  label,
  containerClassName,
  className,
  labelClassName,
  id,
  registration,
  radioButtonSize = 'lg',
  ...props
}) => {
  const radioBtnClassBySize = useMemo(() => {
    switch (radioButtonSize) {
      case 'lg':
        return 'w-5 h-5 before:w-[10px] before:h-[10px] border-2';
      case 'md':
        return 'w-4 h-4 before:w-[8px] before:h-[8px] border-2';
      case 'sm':
        return 'w-3 h-3 before:w-[6px] before:h-[6px] border-[1px]';
      default:
        return '';
    }
  }, [radioButtonSize]);
  return (
    <div className={`${containerClassName} flex items-center`}>
      <input
        id={id}
        type="radio"
        className={mergeClasses(
          'border-silver-sand checked:before:bg-red hover:border-ultra-red-light disabled:bg-black-200 disabled:text-black-400 relative cursor-pointer appearance-none rounded-full bg-white before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-transparent disabled:cursor-default disabled:border-current',
          radioBtnClassBySize,
          className
        )}
        {...registration}
        {...props}
      />
      <label
        htmlFor={id}
        className={mergeClasses(
          'text-granite-gray ml-2 cursor-pointer text-[10px]',
          props.disabled && 'cursor-default',
          labelClassName
        )}
      >
        {label}
      </label>
    </div>
  );
};
