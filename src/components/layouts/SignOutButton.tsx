'use client';

import { useSession } from 'next-auth/react';
import { forwardRef } from 'react';

import { Button, ButtonProps } from '@/components/core';
import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { useLogout } from '@/hooks/features/use-logout';
import { mergeClasses } from '@/utils/common';

export const SignOutButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
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
          onClick={logOut}
          ref={ref}
        >
          {children}
        </Button>
      )
    );
  }
);
