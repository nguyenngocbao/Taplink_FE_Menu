import VietnameseFlagImage from '@/assets/image/vietnamese-flag.png';

export const fallbackLng = 'en';
export const languageInfo = [
  {
    id: fallbackLng,
    name: 'English',
    iconUrl: VietnameseFlagImage
  },
  {
    id: 'vi',
    name: 'Việt Nam',
    iconUrl: VietnameseFlagImage
  }
];
export const languages = languageInfo.map(lang => lang.id);
export const defaultNS = 'translation';
export const cookieName = 'i18next';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns
  };
}
