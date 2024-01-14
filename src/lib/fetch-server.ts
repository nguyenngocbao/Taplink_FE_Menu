'use server';

import { Method } from 'axios';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { isValidHttpUrl } from '@/utils/common';

async function fetchServer<Res>(
  url?: string,
  method?: Method,
  options?: {
    body?: any;
    tags?: any;
    isMock?: boolean;
    noAuth?: boolean;
    headers?: Record<string, string>;
  }
): Promise<Res> {
  try {
    const session = await getServerSession(authOptions);
    const finalUrl = options?.isMock
      ? (process.env.NEXT_PUBLIC_NEXT_SERVER_URL ?? '') + url
      : isValidHttpUrl(url)
      ? url
      : (process.env.NEXT_PUBLIC_SERVER_URL ?? '') + url;

    const response = await fetch(finalUrl, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(!!session &&
          !options?.noAuth && {
            Authorization: `Bearer ${session?.accessToken}`
          }),
        ...(options.headers && options.headers)
      },
      body: options?.body,
      next: {
        tags: options?.tags
      }
    });

    if (!response.ok) {
      throw response;
    }

    return (await response.json()) as Res;
  } catch (e) {
    let error = {
      message: ''
    };

    if (e instanceof Response) {
      if (e.status === 401) {
        return redirect('/login');
      }

      if (e.status === 409) {
        return redirect('/request-email-verification');
      }

      if (e.status === 404) {
        throw new Error('API does not exist: ' + e.url);
      }

      error = await e.json();
    }

    if (e?.cause?.code === 'ECONNREFUSED') {
      throw new Error('Can not connect to server', e.url);
    }

    if (e.status === 500) {
      throw new Error('Internal server error', e.url);
    }

    throw new Error(error?.message ?? 'Failed to fetch data from the server', {
      cause: e
    });
  }
}

export default fetchServer;
