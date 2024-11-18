// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your translation files (we'll create them next)
import enTranslation from './locales/en/translation.json';
import fiTranslation from './locales/fi/translation.json';

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      fi: { translation: fiTranslation },
    },
    lng: 'fi', // Default language
    fallbackLng: 'fi', // Fallback language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
