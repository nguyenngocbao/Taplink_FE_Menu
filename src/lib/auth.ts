import type { NextAuthOptions, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AUTH_APIs } from '@/apis/auth';
import { jwt } from '@/lib/utils';

import axios from './axios';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.NEXTAUTH_JWT_AGE!) || 1209600
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },
      async authorize(credentials) {
        try {
          const data: { user: User; access_token: string } = await axios.post(
            AUTH_APIs.LOGIN,
            credentials
          );

          return { ...data.user, accessToken: data?.access_token };
        } catch (error) {
          if (error instanceof Response) {
            return null;
          }

          throw new Error('An error has occurred during login request');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        if (session.type === 'MANUAL') {
          const user = await axios.get(AUTH_APIs.USER_INFO);
          return { ...token, ...user };
        }

        return { ...token, ...session };
      }

      if (user) {
        return { ...token, ...user };
      }

      const { exp: accessTokenExpires } = jwt.decode(token.accessToken);

      if (!accessTokenExpires) {
        return token;
      }

      const currentUnixTimestamp = Math.floor(Date.now() / 1000);
      const accessTokenHasExpired = currentUnixTimestamp > accessTokenExpires;

      if (accessTokenHasExpired) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        throw new Error('Refresh token has expired');
      }

      session.accessToken = token.accessToken;
      session.user.name = token.name || '';
      session.user.email = token.email || '';
      session.user.email_verified_at = token.email_verified_at;

      return session;
    }
  },
  events: {
    async signOut() {
      await axios.get(AUTH_APIs.LOGOUT);
    }
  }
};

async function refreshAccessToken(token: JWT) {
  try {
    const refreshedAccessToken: { access_token: string } = await axios.post(
      AUTH_APIs.REFRESH
    );

    const { exp } = jwt.decode(refreshedAccessToken.access_token);

    return {
      ...token,
      accessToken: refreshedAccessToken.access_token,
      exp
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}
