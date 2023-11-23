// Do not import next/auth here

import { ACCESS_CONTROLS } from '@/constants/auth';
import { ROLE } from '@/types';

export function isAllowAccess(pathname: string, role: ROLE) {
  const currentRoute = ACCESS_CONTROLS.find(r => r.regex.test(pathname));

  return !currentRoute || currentRoute.roles.includes(role);
}

export const decodeJWT = (token: string | undefined) => {
  if (!token) return;

  return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
};
