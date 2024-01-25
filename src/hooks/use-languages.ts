import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useTranslation } from '@/app/i18n/client';
import { languageInfo } from '@/app/i18n/settings';
import { axios } from '@/lib/axios';

type useLanguagesReturnedData = {
  languages: typeof languageInfo;
  selectedLanguage: (typeof languageInfo)[0];
  onChangeLanguage: (id: string) => void;
};

export const useLanguages = (): useLanguagesReturnedData => {
  const { i18n } = useTranslation('common');

  const selectedLanguage =
    languageInfo.find(l => l.id === i18n.language) ?? languageInfo[0];
  axios.defaults.headers['Accept-Language'] = selectedLanguage?.id;

  const router = useRouter();

  const onChangeLanguage = useCallback(
    lang => {
      if (lang === selectedLanguage.id) return;

      axios.defaults.headers['Accept-Language'] = lang;
      i18n.changeLanguage(lang);
      router.replace(
        window.location.href.replace(`/${selectedLanguage.id}`, `/${lang}`)
      );
    },
    [selectedLanguage]
  );

  return {
    languages: languageInfo,
    selectedLanguage,
    onChangeLanguage
  };
};
