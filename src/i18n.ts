import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationBN from './locales/bn.json';
import translationEN from './locales/en.json';

const resources = {
  bn: { translation: translationBN },
  en: { translation: translationEN }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'bn', // Default to Bangla
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
