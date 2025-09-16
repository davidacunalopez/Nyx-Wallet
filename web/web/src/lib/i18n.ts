import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // Default language
    debug: process.env.NODE_ENV === "development",
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
      requestOptions: {
        cache: "no-store",
      },
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: [],
    },
    load: "languageOnly",
    supportedLngs: ["en", "es"], // Supported languages
    nonExplicitSupportedLngs: true,
  });

export default i18n;
