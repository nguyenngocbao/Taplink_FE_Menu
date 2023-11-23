import { TextareaHTMLAttributes, DetailedHTMLProps } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import { mergeClasses } from '@/utils/common';

import { FieldWrapper } from '../FieldWrapper';

interface TextAreaFieldProps
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  className?: string;
  registration?: Partial<UseFormRegisterReturn>;
  readOnly?: boolean;
  tooltip?: string;
  label?: string | React.ReactElement;
  error?: FieldError | undefined | { message: string[] };
}

export const TextAreaField = ({
  label,
  className,
  registration,
  error,
  tooltip,
  ...props
}: TextAreaFieldProps) => {
  return (
    <FieldWrapper label={label} error={error} tooltip={tooltip}>
      <textarea
        className={mergeClasses(
          'block w-full appearance-none rounded-[10px] border-[0.5px] border-disabled  bg-white px-[12px] py-3 text-[16px]/[22.4px] font-normal placeholder-gray-400 disabled:bg-disabled',
          error ? '!border-warning bg-warning/10' : '',
          className
        )}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  );
};
