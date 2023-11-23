// Do not import next/auth here

import { ROLE } from '@/types';

import { ADMIN_ROUTE, STORE_OWNER_ROUTE } from './routes';

export const ACCESS_CONTROLS: { regex: RegExp; roles: ROLE[] }[] = [
  {
    regex: /^\/login$/,
    roles: ['unknown', 'admin']
  }
];

export const FAILLBACK_ROUTES: Record<ROLE, string> = {
  admin: ADMIN_ROUTE.INDEX,
  store_owner: STORE_OWNER_ROUTE.MYPAGE,
  unknown: STORE_OWNER_ROUTE.LOGIN
};