import { useMemo } from 'react';
import { z } from 'zod';

import { useTranslation } from '@/app/i18n/client';
import { Button, Form, InputField } from '@/components/core';
import { SendOtpRequest } from '@/types/auth';

export const EnterEmailForm = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation(['login', 'common']);

  const schema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t('message.fieldRequired', { ns: 'common' }))
          .email(t('message.emailInvalid', { ns: 'common' }))
      }),
    []
  );

  return (
    <Form<SendOtpRequest, typeof schema>
      onSubmit={onSubmit}
      schema={schema}
      className="w-[calc(100vw_-_64px)] text-left"
    >
      {({ register, formState }) => {
        return (
          <>
            <InputField
              aria-label="email"
              error={formState.errors['email']}
              registration={register('email')}
              placeholder={t('label.emailPlaceholder', { ns: 'common' })}
            />

            <Button
              isLoading={isLoading}
              disabled={isLoading}
              type="submit"
              className="mb-[19px] w-full"
            >
              {t('sendOPT')}
            </Button>
          </>
        );
      }}
    </Form>
  );
};
