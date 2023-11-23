import { StoreAddress } from '@/types/store';

export const getStoreAddress = (address: StoreAddress, lang: string) => {
  if (lang === 'vi') {
    return `${address.detail}, ${address.ward}, ${address.district}, ${address.city}, ${address.nation}.`;
  }
  return `${address.detail}, ${address.ward}, ${address.district}, ${address.city}, ${address.nation}.`;
};
