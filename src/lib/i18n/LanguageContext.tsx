"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import en from "./dictionaries/en.json";
import fr from "./dictionaries/fr.json";

type Locale = "en" | "fr";
type Dictionary = typeof en;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const dictionaries: Record<Locale, Dictionary> = { en, fr };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Read locale from cookie on mount
    const cookies = document.cookie.split("; ");
    const localeCookie = cookies.find((row) => row.startsWith("locale="));
    const initialLocale = localeCookie ? (localeCookie.split("=")[1] as Locale) : "en";
    
    // Ensure the read value is supported
    if (initialLocale === "en" || initialLocale === "fr") {
      setLocaleState(initialLocale);
      document.documentElement.lang = initialLocale;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    
    // Save to cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    document.documentElement.lang = newLocale;

    // Refresh pages to trigger API calls with new Accept-Language
    window.location.reload();
  };

  const t = (key: string, variables?: Record<string, string>): string => {
    const dict = dictionaries[locale];
    let value = (dict as any)[key] || key;

    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        value = value.replace(new RegExp(`{${k}}`, "g"), v);
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
