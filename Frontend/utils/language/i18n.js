import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: require("./en/translation.json"),
  },
  hi: {
    translation: require("./hi/translation.json"),
  },
  as: {
    translation: require("./as/translation.json"), // Assamese
  },
  bn: {
    translation: require("./bn/translation.json"), // Bengali
  },
  gu: {
    translation: require("./gu/translation.json"), // Gujarati
  },
  kn: {
    translation: require("./kn/translation.json"), // Kannada
  },
  ml: {
    translation: require("./ml/translation.json"), // Malayalam
  },
  mr: {
    translation: require("./mr/translation.json"), // Marathi
  },
  or: {
    translation: require("./or/translation.json"), // Oriya
  },
  pa: {
    translation: require("./pa/translation.json"), // Punjabi
  },
  ta: {
    translation: require("./ta/translation.json"), // Tamil
  },
  te: {
    translation: require("./te/translation.json"), // Telugu
  },
  // Add more languages as needed
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
