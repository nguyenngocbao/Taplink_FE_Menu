'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';

import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/Elements';

export const LoginAction = () => {
  const LIMITED_SECONDS = 6;
  const router = useRouter();
  const storeId = useSearchParams().get('store_id');
  const [otp, setOtp] = useState('');
  const [limitedSeconds, setLimitedSeconds] = useState(LIMITED_SECONDS);
  const { t } = useTranslation('login');

  const resendOTP = () => {
    // gửi opt
    setLimitedSeconds(LIMITED_SECONDS);
  };

  const onSubmit = () => {
    if (storeId && otp?.length === 4) {
      console.log(otp);
      // cập nhật section
      router.push('/mypage');
    }
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
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          renderSeparator={<span className="w-[10px]"></span>}
          renderInput={props => (
            <input
              {...props}
              className="h-[48px] !w-[48px] rounded-[4px] border-[0.5px] border-disabled text-[20px]/[24px] font-bold"
            />
          )}
        />
      </div>

      <Button
        disabled={otp.length < 4}
        onClick={onSubmit}
        className="mb-[19px] w-full"
      >
        {t('authen')}
      </Button>
      <p>
        {t('didntReceiveOPT') + ' '}
        <button
          disabled={limitedSeconds > 0}
          onClick={resendOTP}
          className={limitedSeconds > 0 ? '' : 'text-primary'}
        >
          {limitedSeconds === 0
            ? t('resendOPT')
            : `${t('tryAgainAfter')} ${limitedSeconds}s`}
        </button>
      </p>
    </>
  );
};
