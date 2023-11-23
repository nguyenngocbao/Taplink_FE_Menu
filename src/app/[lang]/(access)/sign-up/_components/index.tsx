'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useCallback } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks';
import { userService } from '@/services/user';
import { SignupRequest } from '@/types/user';

import { SignUpForm } from './SignUpForm';

export const SignUp: FC = () => {
  const router = useRouter();
  const query = useSearchParams();
  const callbackUrl = query.get('callbackUrl');
  const { t } = useTranslation(['signUp']);

  const { call: signUp, isLoading } = useDataApi(
    userService.signUp.bind(userService)
  );

  const onSubmit = useCallback(
    async (values: SignupRequest) => {
      try {
        await signUp(values);
        toast.success(t('successMessage'));
        router.push(`${STORE_OWNER_ROUTE.LOGIN}?callbackUrl=${callbackUrl}`);
      } catch (e) {
        console.log(e);
      }
    },
    [router]
  );

  return <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />;
};
