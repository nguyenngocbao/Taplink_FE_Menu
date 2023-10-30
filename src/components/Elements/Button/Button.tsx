'use client';

import * as React from 'react';

import { Spinner } from '@/components/Elements/Indicator';
import { mergeClasses } from '@/utils/common';

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined }
  | { endIcon?: React.ReactElement; startIcon?: React.ReactElement };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: 'primary';
  active?: boolean;
  noEffect?: boolean; // no hover or active effects
} & IconProps;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      isLoading = false,
      startIcon,
      endIcon,
      variant = 'none',
      active,
      noEffect,
      ...props
    },
    ref
  ) => {
    const colorStyle = React.useMemo(() => {
      switch (variant) {
        case 'primary':
          return mergeClasses(
            'text-[12px] leading-[14px] font-bold bg-white text-gray-dark border-current border-[1px] hover:text-white hover:border-dark-silver hover:bg-dark-silver active:text-white active:border-gray-dark active:bg-gray-dark h-[28px] p-[6px_18px_5px]',
            active && 'text-white border-gray-dark bg-gray-dark'
          );
        case 'none':
        default:
          return '';
      }
    }, [variant, active]);

    return (
      <button
        ref={ref}
        className={mergeClasses(
          'text-title-2 disabled:bg-black-200 disabled:text-black-400 flex h-[36px] items-center justify-center rounded-[20px] p-[7px_24px] disabled:cursor-default disabled:border-current',
          'bg-black-200 hover:bg-black-300',
          colorStyle,
          className,
          noEffect && 'cursor-default hover:bg-[s]'
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner isCenter={false} size="sm" className="mr-1 text-current" />
        ) : (
          startIcon
        )}
        <span
          className={
            startIcon && endIcon
              ? 'mx-2'
              : startIcon
              ? 'ml-2'
              : endIcon
              ? 'mr-2'
              : ''
          }
        >
          {props.children}
        </span>{' '}
        {!isLoading && endIcon}
      </button>
    );
  }
);
