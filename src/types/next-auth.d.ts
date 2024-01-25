import 'next-auth';
import type { User } from 'next-auth';

import { ROLE } from '.';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    accessToken?: string;
    error?: string;
  }

  interface User {
    id: number;
    role: ROLE;
    username: string;
    fullName: string;
    email: string;
    phone: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends User {
    accessToken: string;
  }
}
