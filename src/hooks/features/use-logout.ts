import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type UseLogoutProps = {
  callbackUrl: string;
  successMessage?: string;
};

export function useLogout({ callbackUrl, successMessage }: UseLogoutProps) {
  const router = useRouter();
  const [isLoading, setLoading] = useState<boolean>(false);

  const logOut = async () => {
    try {
      setLoading(true);

      await signOut({
        redirect: false
      });

      toast.success(successMessage ?? 'Log out successfully!');

      // TODO: Reset states

      router.push(callbackUrl);
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, logOut };
}
