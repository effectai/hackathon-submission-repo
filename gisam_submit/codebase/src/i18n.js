import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { DateTime } from 'luxon';

i18n
  // i18next-http-backend
  // loads translations from your server
  // https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: false,
    fallbackLng: 'en',
    nonExplicitSupportedLngs: true,
    lowerCaseLng: true,
    load: 'languageOnly',
    backend: {
      loadPath: '/locale/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
      format: (value, format, lng) => {
        if (value instanceof Date) {
          const lang = lng.slice(0, 2);

          // if (lang === "vn") {
          //   lang = "vi";
          // }
          // if (lang === "kr") {
          //   lang = "ko";
          // }
          return DateTime.fromJSDate(value)
            .setLocale(lang)
            .toLocaleString(DateTime[format]);
        }
        return value;
      },
    },
  });

export default i18n;
