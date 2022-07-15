import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslation from './locales/en';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: enTranslation,
    },
  },
  fallbackLng: 'en',
  debug: false,
  ns: ['translations'],
  defaultNS: 'translations',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
