import en from "./translations/en";
import fr from "./translations/fr";
import es from "./translations/es";
import pt from "./translations/pt";
import de from "./translations/de";
import it from "./translations/it";
import zh from "./translations/zh";
import ar from "./translations/ar";

export type Locale = "en" | "fr" | "es" | "pt" | "de" | "it" | "zh" | "ar";

export const locales: { code: Locale; label: string; flag: string; dir?: "rtl" }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ar", label: "العربية", flag: "🇸🇦", dir: "rtl" },
];

export const translations = {
  en,
  fr,
  es,
  pt,
  de,
  it,
  zh,
  ar,
};

export type Translations = typeof en;

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations.en;
}

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "prolify-locale";
