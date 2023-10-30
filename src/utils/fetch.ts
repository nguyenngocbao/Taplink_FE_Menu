import { cookies } from 'next/dist/client/components/headers';
import { redirect } from 'next/navigation';

import { COMMON_ROUTE } from '@/constants/routes';

export async function fetchAuth(input: string): Promise<Response> {
  const token = cookies()?.get('session')?.value;
  const res = await fetch(process.env.SERVER_URL + input, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  });

  if (res.status === 401) {
    redirect(COMMON_ROUTE.LOGIN);
  }

  return res;
}
