'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useDataApi } from '@/hooks';
import { useLogin } from '@/hooks/features/use-login';
import { authService } from '@/services/auth';
import { SendOtpRequest, VerifyOtpRequest } from '@/types/auth';
import { isOnServer, mergeQueryParams } from '@/utils/common';

import { EnterEmailForm } from './EnterEmailForm';
import { EnterOTPForm } from './EnterOTPForm';

type LoginStep = 'email' | 'otp';

export const LoginAction = () => {
  const query = new URLSearchParams(
    isOnServer() ? '' : window.location.search.substring(1)
  );
  const email = query.get('email');
  const callbackUrl = query.get('callbackUrl');

  const { t } = useTranslation(['login', 'common']);
  const [step, setStep] = useState<LoginStep>(
    (query.get('step') ?? 'email') as LoginStep
  );

  const LIMITED_SECONDS = 6;
  const [limitedSeconds, setLimitedSeconds] = useState(LIMITED_SECONDS);

  const sendOTPStore = useDataApi(authService.sendOTP.bind(authService));
  const loginStore = useLogin<VerifyOtpRequest>({
    callbackUrl: callbackUrl ?? '/mypage',
    successMessage: t('loginSuccess')
  });

  if (step === 'otp' && !email) {
    setStep('email');
  }

  const resendOTP = async () => {
    await sendOTPStore.call({
      email: email
    });
    setLimitedSeconds(LIMITED_SECONDS);
  };

  const onSubmitOTP = async (otp: string) => {
    if (otp?.length === 6) {
      const error = await loginStore.onSubmit({
        email: email,
        password: otp
      });
      if (error) {
        toast.error(t('invalidOpt'));
      }
    }
  };

  const onSubmitEmail = async (values?: SendOtpRequest) => {
    await sendOTPStore.call({
      email: values.email
    });
    const newUrl = mergeQueryParams({ step: 'opt', email: values.email });
    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      document.title,
      newUrl
    );
    setStep('otp');
  };

  useEffect(() => {
    if (limitedSeconds === 0) return;

    const cancel = setInterval(() => {
      setLimitedSeconds(pre => {
        if (pre > 0) return pre - 1;
        return 0;
      });
    }, 1000);

    return () => clearInterval(cancel);
  }, [limitedSeconds > 0]);

  return (
    <>
      <div className="mb-[36px]">
        <p className="mb-[8px] text-[20px]/[24px] font-bold">
          {step === 'email' ? t('enterEmail') : t('enterOTPOnTime')}
        </p>
        <p> {t('enterOTPDesc')}</p>
      </div>
      {step === 'email' ? (
        <EnterEmailForm
          onSubmit={onSubmitEmail}
          isLoading={sendOTPStore.isLoading}
        />
      ) : (
        <EnterOTPForm
          onSubmit={onSubmitOTP}
          onResendOTP={resendOTP}
          limitedSeconds={limitedSeconds}
          isResending={sendOTPStore.isLoading}
          isLoading={loginStore.isLoading}
        />
      )}
      {step === 'email' && (
        <p className="mt-9">
          {t('noAccount')},{' '}
          <Link
            className="text-primary"
            href={{
              pathname: STORE_OWNER_ROUTE.SIGN_UP,
              search: `callbackUrl=${callbackUrl}`
            }}
          >
            {t('signUp')}
          </Link>
        </p>
      )}
    </>
  );
};
