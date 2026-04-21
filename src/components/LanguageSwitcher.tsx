"use client";

import { Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/contexts/I18nContext";

export function LanguageSwitcher() {
  const { locale, setLocale, locales } = useI18n();
  if (locales.length <= 1) return null;

  const current = locales.find((l) => l.code === locale);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center gap-1 h-8 px-2.5 text-xs font-bold text-black dark:text-white rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-200 whitespace-nowrap"
          aria-label="Change language"
        >
          <Globe className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="hidden lg:inline">{current?.label ?? "EN"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-52 p-2 bg-white dark:bg-[#171717] border-2 border-black dark:border-white rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
        align="end"
        sideOffset={8}
      >
        <div className="space-y-0.5">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-lg transition-all duration-150 ${
                locale === l.code
                  ? "bg-[#FFC107] dark:bg-[#FFD54F] text-black"
                  : "text-black dark:text-white hover:bg-[#FFC107]/30 dark:hover:bg-[#FFD54F]/20 hover:text-black dark:hover:text-white"
              }`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span>{l.label}</span>
              {locale === l.code && (
                <span className="ml-auto text-[10px] font-black">✓</span>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
