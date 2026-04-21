import en from "./translations/en";

export type Locale = "en";

export const locales: { code: Locale; label: string; flag: string; dir?: "rtl" }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
];

export const translations = {
  en,
};

export type Translations = typeof en;

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations.en;
}

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "prolify-locale";
