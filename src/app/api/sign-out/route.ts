import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { NextRequestWithAuth } from 'next-auth/middleware';

import { STORE_OWNER_ROUTE } from '@/constants/routes';

// This is signout api, when call it, you will be redirect to aproriate login page which is suitable for your role

export async function GET(request: NextRequestWithAuth) {
  let response = null;
  const headersList = headers();
  const referer = headersList.get('referer');

  let loginRoute = STORE_OWNER_ROUTE.LOGIN;
  // Add callback url
  // Callback url: url will be redirected to when login successfully
  if (referer) {
    // Redirect to approriate login page base on callback url
    const { pathname, search } = new URL(referer);
    loginRoute = loginRoute + '?callbackUrl=' + pathname + search;

    response = NextResponse.redirect(
      process.env.NEXT_PUBLIC_NEXT_SERVER_URL + loginRoute
    );
  } else {
    // Redirect to approriate login page base on role
    response = NextResponse.redirect(
      process.env.NEXT_PUBLIC_NEXT_SERVER_URL + loginRoute
    );
  }

  if (request.cookies.has('next-auth.session-token')) {
    response.cookies.delete('next-auth.session-token');
  }

  return response;
}
