import { useState } from 'react';
import OtpInput from 'react-otp-input';

import { useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/core';

export const EnterOTPForm = ({
  onSubmit,
  isLoading,
  isResending,
  onResendOTP,
  limitedSeconds
}) => {
  const [otp, setOtp] = useState('');
  const { t } = useTranslation(['login', 'common']);

  return (
    <>
      <div className="mb-[36px]">
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderSeparator={<span className="w-[10px]"></span>}
          renderInput={props => (
            <input
              {...props}
              type="number"
              className="h-[48px] !w-[48px] rounded-[4px] border-[0.5px] border-disabled text-[20px]/[24px] font-bold"
            />
          )}
        />
      </div>
      <Button
        disabled={otp.length < 4 || isLoading}
        onClick={() => onSubmit(otp)}
        isLoading={isLoading}
        className="mb-[19px] w-full"
      >
        {t('authen')}
      </Button>
      <p>
        {t('didntReceiveOPT') + ' '}
        <button
          disabled={limitedSeconds > 0 || isResending}
          onClick={onResendOTP}
          className={limitedSeconds > 0 ? '' : 'text-primary'}
        >
          {isResending
            ? 'Resending...'
            : limitedSeconds === 0
            ? t('resendOPT')
            : `${t('tryAgainAfter')} ${limitedSeconds}s`}
        </button>
      </p>
    </>
  );
};
