'use server';

import { Method } from 'axios';
import { redirect } from 'next/navigation';
import { Session, getServerSession } from 'next-auth';

import { STORE_OWNER_ROUTE } from '@/constants/routes';
import { authOptions } from '@/lib/auth';
import { isValidHttpUrl } from '@/utils/common';

interface FetchOptions {
  body?: BodyInit | null;
  tags?: string[];
  isMock?: boolean;
  noAuth?: boolean;
  headers?: Record<string, string>;
  noCache?: boolean;
}

interface ErrorResponse extends Error {
  status?: number;
  url?: string;
  cause?: AggregateError & { code?: string };
}

/**
 * Fetches data from the server, with optional authentication, caching, and error handling.
 *
 * @param url The endpoint URL.
 * @param method The HTTP method to use (GET, POST, PUT, DELETE, etc.).
 * @param options Additional options including:
 *  - body: The request payload.
 *  - tags: Tags for caching.
 *  - isMock: Whether to use a mock server.
 *  - noAuth: Whether to skip authentication.
 *  - headers: Additional headers to include in the request.
 *  - noCache: Whether to disable caching.
 *
 * @returns The response data from the server.
 */
async function fetchServer<Res>(
  url: string,
  method: Method,
  options?: FetchOptions
): Promise<Res> {
  let session: Session | null = null;
  let finalUrl = null;

  // Handle authentication
  if (!options?.noAuth) {
    session = await getServerSession(authOptions);
  }

  // Construct the final URL
  if (options?.isMock) {
    // use mock server and add prefix mock to api
    finalUrl = `${
      process.env.NEXT_PUBLIC_NEXT_SERVER_URL ?? ''
    }/api/mock${url}`;
  } else if (isValidHttpUrl(url)) {
    // use whole url
    finalUrl = url;
  } else {
    // use server api url
    finalUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${url}`;
  }

  try {
    const response = await fetch(finalUrl, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(!options?.noAuth &&
          session &&
          session.accessToken && {
            Authorization: session.accessToken
          }),
        ...options?.headers
      },
      body: options?.body,
      next: {
        tags: options?.tags
      },
      ...(options?.noCache && { cache: 'no-store' })
    });

    // Check for successful response
    if (!response.ok) {
      throw response;
    }

    return (await response.json()) as Res;
  } catch (e) {
    const error = e as ErrorResponse;

    // Handle server no response errors
    if (error instanceof Error && error.cause instanceof AggregateError) {
      const causeWithCode = error.cause;
      if (causeWithCode.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server.', { cause: error });
      }
    }

    // Handle server response errors
    if (error instanceof Response) {
      if (error.status === 401) {
        return redirect(STORE_OWNER_ROUTE.SIGN_OUT);
      }

      if (error.status === 404) {
        throw new Error(`API does not exist: ${error.url}`, { cause: error });
      }

      if (error.status === 500) {
        throw new Error('An internal server error has occurred', {
          cause: error
        });
      }

      try {
        const jsonError = await error.json();
        error.message = jsonError.message;
      } catch (er) {
        console.error(
          `Failed to fetch url [${finalUrl}] with code ${error.status}: `,
          er
        );
        throw new Error(
          `Error from ${finalUrl} URL with code ${error.status}.`,
          {
            cause: error
          }
        );
      }
    }

    // Handle unknown errors
    console.error(
      `[${finalUrl}]: ` +
        (error.message ?? 'Failed to fetch data from the server')
    );
    throw new Error(
      error.message ?? 'An error occurred while fetching data from the server.',
      { cause: error }
    );
  }
}

export default fetchServer;
