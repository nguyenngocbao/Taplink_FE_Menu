import clsx from 'clsx';
import { TextareaHTMLAttributes, DetailedHTMLProps } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

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
        className={clsx(
          'border-silver-sand block w-full appearance-none rounded-md border px-[12px] py-3 placeholder-gray-400 sm:text-sm',
          className
        )}
        {...registration}
        {...props}
      />
    </FieldWrapper>
  );
};
