"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  type Locale,
  type Translations,
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
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
  const pathname = usePathname();
  const effectiveLocale: Locale = pathname === "/" ? "en" : locale;

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && locales.some((l) => l.code === stored)) {
      setLocaleState(stored);
    } else {
      const browser = navigator.language.split("-")[0] as Locale;
      if (locales.some((l) => l.code === browser)) {
        setLocaleState(browser);
      }
    }
  }, []);

  useEffect(() => {
    const currentLocale = locales.find((l) => l.code === effectiveLocale);
    const dir = currentLocale?.dir ?? "ltr";
    document.documentElement.lang = effectiveLocale;
    document.documentElement.dir = dir;
  }, [effectiveLocale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
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
