export const COMMON_ROUTE = {};

export const STORE_OWNER_ROUTE = {
  ...COMMON_ROUTE,
  LOGIN: '/login',
  HOME: '/',
  CREATE_STORE: '/store/create',
  STORE: '/store',
  SIGN_UP: '/sign-up'
};

export const ADMIN_ROUTE = {
  ...COMMON_ROUTE,
  INDEX: ''
};
