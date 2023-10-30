const storagePrefix = 'tap_link_fe';

const storage = {
  getToken: () => {
    const token = window.localStorage.getItem(`${storagePrefix}token`);
    return token ? JSON.parse(token) : undefined;
  },
  setToken: (token: string) => {
    window.localStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  }
};

export default storage;
