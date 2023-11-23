import { FC, memo, useMemo } from 'react';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { Button, Form, InputField } from '@/components/core';
import { SignupRequest } from '@/types/user';

interface SignUpForm {
  isLoading?: boolean;
  onSubmit?: (values: SignupRequest) => void;
}

export const SignUpForm: FC<SignUpForm> = memo(({ isLoading, onSubmit }) => {
  const { t } = useTranslation(['signUp', 'common']);

  const schema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(1, t('message.fieldRequired', { ns: 'common' })),
        fullName: z
          .string()
          .min(1, t('message.fieldRequired', { ns: 'common' })),
        phone: z.string().min(1, t('message.fieldRequired', { ns: 'common' })),
        email: z
          .string()
          .min(1, t('message.fieldRequired', { ns: 'common' }))
          .email(t('message.emailInvalid', { ns: 'common' }))
      }),
    []
  );

  return (
    <Form<SignupRequest, typeof schema> onSubmit={onSubmit} schema={schema}>
      {({ register, formState }) => {
        return (
          <>
            <InputField
              aria-label="username"
              error={formState.errors['username']}
              registration={register('username')}
              label={t('username')}
              placeholder={t('usernamePlaceholder')}
            />

            <InputField
              aria-label="fullName"
              error={formState.errors['fullName']}
              registration={register('fullName')}
              label={t('fullName')}
              placeholder={t('fullNamePlaceholder')}
            />

            <InputField
              type="phone"
              aria-label="phone"
              error={formState.errors['phone']}
              registration={register('phone')}
              label={t('Phone')}
              placeholder={t('phonePlaceholder')}
            />

            <InputField
              type="email"
              aria-label="email"
              error={formState.errors['email']}
              registration={register('email')}
              label={t('Email')}
              placeholder={t('emailPlaceholder')}
            />

            <Button
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
              className="w-full"
            >
              {t('signUp')}
            </Button>
          </>
        );
      }}
    </Form>
  );
});
