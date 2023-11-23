import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

type METHOD = 'GET' | 'POST' | 'PUT';

async function fetchServer<Res>(
  url?: string,
  method?: METHOD,
  options?: {
    body: string;
  }
): Promise<Res> {
  try {
    const session = await getServerSession(authOptions);

    const response = await fetch(
      (process.env.SERVER_URL ?? '') + url.toString(),
      {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + session?.accessToken
        },
        body: options?.body ?? undefined
      }
    );

    if (!response.ok) {
      throw response;
    }

    return (await response.json()) as Res;
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === 401) {
        return redirect('/login');
      }

      if (error.status === 409) {
        return redirect('/request-email-verification');
      }
    }

    throw new Error('Failed to fetch data from the server', { cause: error });
  }
}

export default fetchServer;
