import { UserResponse } from '@/types/auth';
import storage from '@/utils/storage';

export async function handleUserResponse(data: UserResponse) {
  const { access_token, user } = data;
  storage.setToken(access_token);
  setClientCookie('session', access_token, 1);
  return user;
}

// async function registerFn(data: RegisterCredentialsDTO) {
//   const response = await registerWithEmailAndPassword(data);
//   const user = await handleUserResponse(response);
//   return user;
// }

export async function logoutFn() {
  storage.clearToken();
  deleteClientCookie('session');
}

export function getClientCookie(name) {
  return document.cookie.split(';').some(c => {
    return c.trim().startsWith(name + '=');
  });
}

export function deleteClientCookie(
  name: string,
  path?: string,
  domain?: string
) {
  if (getClientCookie(name)) {
    document.cookie =
      name +
      '=' +
      (path ? ';path=' + path : '') +
      (domain ? ';domain=' + domain : '') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }
}

export function setClientCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
