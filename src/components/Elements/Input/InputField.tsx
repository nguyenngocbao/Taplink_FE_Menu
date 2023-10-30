import Image from 'next/image';
import {
  DetailedHTMLProps,
  FC,
  InputHTMLAttributes,
  memo,
  useCallback,
  KeyboardEventHandler,
  useRef,
  MutableRefObject
} from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import {
  FieldWrapper,
  FieldWrapperPassThroughProps
} from '@/components/Elements/FieldWrapper';
import { mergeClasses } from '@/utils/common';

interface InputValidation {
  numberHalfWidth?: boolean;
  numberFullWidth?: boolean;
  maxLength?: number;
  max?: number;
}
export interface InputFieldProps
  extends DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    FieldWrapperPassThroughProps {
  className?: string;
  labelClassName?: string;
  containerClassName?: string;
  registration?: Partial<UseFormRegisterReturn>;
  sufixIcon?: string | React.ReactElement;
  sufixAlt?: string;
  prefixIcon?: string | React.ReactElement;
  disabled?: boolean;
  validation?: InputValidation;
  inputRef?: MutableRefObject<HTMLInputElement>;
  onClickSufixIcon?: (e) => void;
}

export const InputField: FC<InputFieldProps> = memo(
  ({
    type = 'text',
    label,
    htmlFor,
    className,
    labelClassName,
    containerClassName,
    registration,
    error,
    sufixIcon,
    sufixAlt,
    prefixIcon,
    onClickSufixIcon,
    disabled,
    isRequired,
    validation,
    onInput,
    inputRef,
    tooltip,
    ...props
  }) => {
    // Only use for uncontrolled component
    const preInputValue = useRef('');
    const _onInput: KeyboardEventHandler<HTMLInputElement> = useCallback(
      e => {
        if (validation) {
          const target: any = e.target;

          if (
            validation?.maxLength &&
            target.value.length > validation?.maxLength
          ) {
            target.value = preInputValue.current;
          }

          if (
            validation?.max &&
            (Number.isNaN(target.value) ||
              Number(target.value) > validation.max)
          ) {
            target.value = preInputValue.current;
          }

          preInputValue.current = target.value;
        }
        onInput && onInput(e);
      },
      [onInput, validation]
    );

    return (
      <FieldWrapper
        label={label}
        htmlFor={htmlFor}
        error={error}
        isRequired={isRequired}
        className={mergeClasses('w-full', containerClassName)}
        labelClassName={labelClassName}
        tooltip={tooltip}
      >
        <input
          type={type}
          id={htmlFor}
          disabled={disabled}
          onInput={_onInput}
          className={mergeClasses(
            'border-silver-sand text-black-700 disabled:bg-black-200 relative block h-[40px] w-full appearance-none  rounded-[4px] border bg-white py-3 text-[14px] leading-[20px] placeholder-gray-400',
            error ? '!border-red-cc1 bg-pink-f5d' : '',
            prefixIcon ? 'px-[56px]' : 'px-[12px]',
            className
          )}
          ref={inputRef}
          {...registration}
          {...props}
        />
        {sufixIcon && (
          <>
            <button
              className="absolute right-0 top-[50%] flex h-[45px] w-[60px] translate-y-[-50%] items-center justify-center"
              type="button"
              onClick={onClickSufixIcon}
            >
              {typeof sufixIcon === 'string' ? (
                <Image
                  className="cursor-pointer"
                  src={sufixIcon}
                  alt={sufixAlt}
                  aria-live="polite"
                  width={20}
                />
              ) : (
                sufixIcon
              )}
            </button>
          </>
        )}
        {prefixIcon &&
          (typeof prefixIcon === 'string' ? (
            <Image
              className="absolute left-[20px] top-[50%] translate-y-[-50%]"
              src={prefixIcon}
              alt=""
            />
          ) : (
            prefixIcon
          ))}
      </FieldWrapper>
    );
  }
);

InputField.displayName = 'InputField';
