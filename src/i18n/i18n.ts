import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslation from './locales/en';
// import deTranslation from './locales/de';
// import esTranslation from './locales/es';
// import frTranslation from './locales/fr';
// import itTranslation from './locales/it';

/* multi languages have been added but never used because of the need to create a responsive design for the application */
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: enTranslation,
    },
    // de: {
    //   translations: deTranslation,
    // },
    // es: {
    //   translations: esTranslation,
    // },
    // fr: {
    //   translations: frTranslation,
    // },
    // it: {
    //   translations: itTranslation,
    // },
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
