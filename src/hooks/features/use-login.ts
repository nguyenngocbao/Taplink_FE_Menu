import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'react-toastify';

type UseLoginProps = {
  callbackUrl?: string;
  successMessage?: string;
};

export function useLogin<LoginForm>({
  callbackUrl,
  successMessage
}: UseLoginProps) {
  const router = useRouter();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>(null);

  const onSubmit = async (values: LoginForm) => {
    try {
      setLoading(true);
      const res = await signIn('credentials', {
        ...values,
        redirect: false
      });
      if (res.status === 200) {
        setServerError(null);
        router.push(callbackUrl);
        if (successMessage) {
          toast.success(successMessage);
        }
        return;
      }

      setServerError(res.error);
      setLoading(false);
      return res.error;
    } catch (e) {
      console.log(e);
    }
  };

  return { isLoading, serverError, onSubmit };
}
