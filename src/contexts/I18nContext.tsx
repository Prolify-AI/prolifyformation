"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type Locale,
  type Translations,
  DEFAULT_LOCALE,
  getTranslations,
  locales,
} from "@/lib/i18n";

interface I18nContextValue {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
  locales: typeof locales;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const effectiveLocale: Locale = "en";

  useEffect(() => {
    const currentLocale = locales.find((l) => l.code === "en");
    const dir = currentLocale?.dir ?? "ltr";
    document.documentElement.lang = "en";
    document.documentElement.dir = dir;
  }, []);

  const setLocale = useCallback((_newLocale: Locale) => {
    setLocaleState("en");
  }, []);

  const currentLocale = locales.find((l) => l.code === effectiveLocale);
  const dir = (currentLocale?.dir ?? "ltr") as "ltr" | "rtl";

  const value: I18nContextValue = {
    locale: effectiveLocale,
    t: getTranslations(effectiveLocale),
    setLocale,
    locales,
    dir,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
