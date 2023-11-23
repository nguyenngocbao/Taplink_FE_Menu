'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import React, { FC, memo, useState } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

import { mergeClasses } from '@/utils/common';

import { InputField, InputFieldProps } from './InputField';

interface InputPasswordProps extends InputFieldProps {
  error?: FieldError | undefined;
  registration?: Partial<UseFormRegisterReturn>;
  className?: string;
  placeholder?: string | undefined;
}

export const PasswordField: FC<InputPasswordProps> = memo(
  ({ error, registration, placeholder, className, disabled, ...props }) => {
    const [isShowPassword, setShowPassword] = useState(false);

    return (
      <InputField
        disabled={disabled}
        type={isShowPassword ? 'text' : 'password'}
        error={error}
        registration={registration}
        className={mergeClasses('eye-open', className)}
        placeholder={placeholder}
        sufixIcon={
          disabled ? null : isShowPassword ? (
            <EyeIcon className="h-[20px] w-[20px]" />
          ) : (
            <EyeSlashIcon className="h-[20px] w-[20px]" />
          )
        }
        sufixAlt={isShowPassword ? 'Hide password' : 'Show password'}
        onClickSufixIcon={() => setShowPassword(pre => !pre)}
        {...props}
      />
    );
  }
);

PasswordField.displayName = 'InputPassword';
