'use client';

import { useSession } from 'next-auth/react';
import { forwardRef } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { Button, ButtonProps } from '@/components/core';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useLogout } from '@/hooks/features/use-logout';
import { useDispatch } from '@/stores';
import {
  hideConfirmDialog,
  showConfirmDialog
} from '@/stores/slices/confirmDialog';
import { mergeClasses } from '@/utils/common';

export const SignOutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('common');
    const { data } = useSession();
    const { isLoading, logOut } = useLogout({
      callbackUrl: STORE_OWNER_ROUTE.LOGIN
    });

    return (
      !!data && (
        <Button
          className={mergeClasses('justify-start', className)}
          isLoading={isLoading}
          {...props}
          disabled={isLoading}
          onClick={() => {
            dispatch(
              showConfirmDialog({
                title: t('label.logout'),
                desc: t('message.confirmLogout'),
                submitBtnText: t('label.yes'),
                cancelBtnText: t('label.no'),
                async callback() {
                  await logOut();
                  dispatch(hideConfirmDialog());
                }
              })
            );
          }}
          ref={ref}
        >
          {children}
        </Button>
      )
    );
  }
);
