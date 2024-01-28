import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/app/i18n/client';

type UseLogoutProps = {
  callbackUrl: string;
  successMessage?: string;
};

export function useLogout({ callbackUrl, successMessage }: UseLogoutProps) {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation('common');

  const logOut = async () => {
    try {
      setLoading(true);

      await signOut({
        redirect: false
      });

      toast.success(successMessage ?? t('message.logoutSuccess'));

      // TODO: Reset states

      router.push(callbackUrl);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, logOut };
}
