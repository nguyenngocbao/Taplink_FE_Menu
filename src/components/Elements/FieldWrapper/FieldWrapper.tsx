import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import * as React from 'react';
import { FieldError } from 'react-hook-form';

import { ERROR_MESSAGE_ID } from '@/constants';
import { mergeClasses } from '@/utils/common';

import { Tooltip } from '../Tooltip';

type FieldWrapperProps = {
  as?: string;
  label?: string | React.ReactElement;
  htmlFor?: string;
  labelClassName?: string;
  children: React.ReactNode;
  error?: FieldError | undefined | { message: string[] };
  description?: string;
  labelPosition?: 'left' | 'top';
  className?: string;
  isRequired?: boolean;
  tooltip?: string | JSX.Element;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  'className' | 'children'
>;

export const FieldWrapper = React.memo((props: FieldWrapperProps) => {
  const {
    label,
    as = 'label',
    labelPosition = 'top',
    className,
    htmlFor,
    labelClassName,
    error,
    children,
    isRequired,
    tooltip
  } = props;
  const CustomTag = as as keyof JSX.IntrinsicElements;
  return (
    <div className={className}>
      <CustomTag
        className="relative block text-[14px] leading-[18px] text-gray-700"
        htmlFor={htmlFor}
      >
        <div
          className={mergeClasses(
            labelPosition == 'top'
              ? 'flex flex-col gap-[4px]'
              : 'flex items-center'
          )}
        >
          {label && (
            <div className="flex items-center gap-[8px]">
              <span className={labelClassName}>{label}</span>
              {isRequired && (
                <span className="bg-baby-pink text-red h-[18px] w-[40px] rounded-[4px] text-center text-[12px]">
                  必須
                </span>
              )}
              {tooltip && (
                <span className="item-center flex">
                  <Tooltip content={tooltip} className="h-fit">
                    <QuestionMarkCircleIcon className="text-dark-silver-70 h-[20px] w-[20px]" />
                  </Tooltip>
                </span>
              )}
            </div>
          )}

          {error?.message &&
            (Array.isArray(error.message) ? (
              <>
                {error.message.map(m => (
                  <div
                    key={m}
                    role="alert"
                    id={ERROR_MESSAGE_ID}
                    aria-label={m}
                    className="text-red text-[12px] leading-[18px]"
                  >
                    {m}
                  </div>
                ))}
              </>
            ) : (
              <div
                role="alert"
                id={ERROR_MESSAGE_ID}
                aria-label={error.message}
                className="text-red text-[12px] leading-[18px]"
              >
                {error.message}
              </div>
            ))}
          <div className="relative flex-1">{children}</div>
        </div>
      </CustomTag>
    </div>
  );
});
