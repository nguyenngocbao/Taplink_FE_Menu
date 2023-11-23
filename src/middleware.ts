import acceptLanguage from 'accept-language';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';

import { isAllowAccess } from '@/utils/auth';

import { fallbackLng, languages, cookieName } from './app/i18n/settings';
import { FAILLBACK_ROUTES } from './constants/auth';

acceptLanguage.languages(languages);

export default withAuth(
  async function middleware(req: NextRequestWithAuth) {
    // handle lang redirect
    let lng;
    if (req.cookies.has(cookieName))
      lng = acceptLanguage.get(req.cookies.get(cookieName).value);
    if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
    if (!lng) lng = fallbackLng;

    // Redirect if lng in path is not supported
    if (
      !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !req.nextUrl.pathname.startsWith('/_next')
    ) {
      return NextResponse.redirect(
        new URL(
          `/${lng}${req.nextUrl.pathname}${req.nextUrl.search}`,
          req.nextUrl
        )
      );
    }

    if (req.headers.has('referer')) {
      const refererUrl = new URL(req.headers.get('referer'));
      const lngInReferer = languages.find(l =>
        refererUrl.pathname.startsWith(`/${l}`)
      );
      const response = NextResponse.next();
      if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
      return response;
    }

    // handle authen access
    const user = await getToken({ req });
    const userRole = user?.role ?? 'unknown';
    const nextPathname = req.nextUrl.pathname;
    if (!isAllowAccess(nextPathname, userRole)) {
      return NextResponse.redirect(
        req.nextUrl.origin + FAILLBACK_ROUTES[userRole]
      );
    }
  },
  {
    callbacks: {
      authorized() {
        return true;
      }
    }
  }
);

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico)[^\n.]*)',
      // Fixing error: cannot prefetch if not authenticated.
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' }
      ]
    }
  ]
};
