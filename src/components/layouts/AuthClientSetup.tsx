'use client';

import { Session } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';

import { FAILLBACK_ROUTES } from '@/constants/auth';
import axios from '@/lib/axios';

export const AuthClientSetup = ({ session }: { session: Session }) => {
  // setup axios
  axios.defaults.headers['Accept'] = 'application/json';

  const accessToken = session?.accessToken;
  if (accessToken) {
    axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
  } else {
    axios.defaults.headers['Authorization'] = undefined;
  }

  useSession();

  if (session?.error === 'RefreshAccessTokenError') {
    signOut({
      redirect: false,
      callbackUrl: FAILLBACK_ROUTES[session.user.role]
    });
  }

  return null;
};
