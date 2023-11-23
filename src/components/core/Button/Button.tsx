import * as React from 'react';

import { Spinner } from '@/components/core/Indicator';
import { mergeClasses } from '@/utils/common';

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined }
  | { endIcon?: React.ReactElement; startIcon?: React.ReactElement };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: 'primary' | 'none';
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
      variant = 'primary',
      active,
      noEffect,
      ...props
    },
    ref
  ) => {
    const colorStyle = React.useMemo(() => {
      switch (variant) {
        case 'primary':
          return mergeClasses('text-white bg-primary');
        case 'none':
        default:
          return mergeClasses('bg-gray-200 text-black/80');
      }
    }, [variant, active]);

    return (
      <button
        ref={ref}
        className={mergeClasses(
          'flex h-[46px] items-center justify-center rounded-[10px] p-[7px_24px] text-[16px]/[22.4px] font-[600] disabled:cursor-default disabled:border-current disabled:bg-disabled disabled:text-black/20',
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
        </span>
        {!isLoading && endIcon}
      </button>
    );
  }
);
