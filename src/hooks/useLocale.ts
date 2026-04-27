import { useState, useEffect } from "react";

export type Locale = "en" | "pt" | "es" | "fr";

const STORAGE_KEY = "brite-locale";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && ["en", "pt", "es", "fr"].includes(stored)) return stored;
    const lang = navigator.language.slice(0, 2);
    if (lang === "pt") return "pt";
    if (lang === "es") return "es";
    if (lang === "fr") return "fr";
    return "en";
  });

  function setLocale(l: Locale) {
    localStorage.setItem(STORAGE_KEY, l);
    setLocaleState(l);
  }

  return { locale, setLocale };
}
