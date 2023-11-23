import type { NextAuthOptions, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { getServerSession as getNextServerSession } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AUTH_APIs } from '@/services/auth';
import { decodeJWT } from '@/utils/auth';

import fetchServer from './fetch-server';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.NEXTAUTH_JWT_AGE) || 1209600
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
        const { userInfo, token }: { userInfo: User; token: string } =
          await fetchServer(AUTH_APIs.VERIFY_OTP, 'POST', {
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

        return { accessToken: token, ...userInfo };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // if (trigger === 'update') {
      //   if (session.type === 'MANUAL') {
      //     const user: any = await fetchServer(
      //       (session.role as ROLE) === 'member'
      //         ? AUTH_APIs.MEMBER_INFO
      //         : AUTH_APIs.ADMIN_INFO
      //     );
      //     return { ...token, ...user, role: getUserRole(user) };
      //   }

      //   return { ...token, ...session };
      // }

      if (user) {
        return { ...token, ...user, role: user.role };
      }

      const { exp: accessTokenExpires } = decodeJWT(token.accessToken);

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
      session.accessToken = token.accessToken;
      session.user.name = token.name || '';
      session.user.email = token.email || '';
      session.user.id = token?.id;

      session.user.email = token?.email;
      session.user.email = token?.email;
      session.user.phone = token?.phone;
      session.user.role = token.role;

      session.error = token.error as string;

      return session;
    }
  },
  events: {
    async signOut() {
      await fetchServer(AUTH_APIs.LOGOUT, 'POST');
    }
  }
};

async function refreshAccessToken(token: JWT) {
  // try {
  //   const refreshedAccessToken: { access_token: string } = await fetchServer(
  //     AUTH_APIs.REFRESH
  //   );

  //   const { exp } = jwt.decode(refreshedAccessToken.access_token);

  //   return {
  //     ...token,
  //     accessToken: refreshedAccessToken.access_token,
  //     exp
  //   };
  // } catch (error) {
  return {
    ...token,
    error: 'RefreshAccessTokenError'
  };
  // }
}

export async function getCurrentUser() {
  const session = await getNextServerSession(authOptions);

  return session?.user;
}

export async function getServerSession() {
  const session = await getNextServerSession(authOptions);

  return session;
}
