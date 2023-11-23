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
        className="relative block text-[16px]/[22.4px] font-[600] text-gray-700"
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
                <span className="bg-baby-pink h-[18px] shrink-0 rounded-[4px] bg-warning px-1 text-center text-[12px] text-white">
                  Required
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

          <div className="relative flex-1">{children}</div>
          {error?.message &&
            (Array.isArray(error.message) ? (
              <>
                {error.message.map(m => (
                  <div
                    key={m}
                    role="alert"
                    id={ERROR_MESSAGE_ID}
                    aria-label={m}
                    className="text-[12px] leading-[18px] text-warning"
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
                className="text-[12px] leading-[18px] text-warning"
              >
                {error.message}
              </div>
            ))}
        </div>
      </CustomTag>
    </div>
  );
});
