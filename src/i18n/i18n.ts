import { i18n } from "@lingui/core";
import { messages as enArtMessages } from "@edurune/art/locales/en";
import { messages as viArtMessages } from "@edurune/art/locales/vi";
import { messages as enMessages } from "../locales/en/messages.ts";
import { messages as viMessages } from "../locales/vi/messages.ts";

export const LOCALES = ["en", "vi"] as const;
export type AppLocale = (typeof LOCALES)[number];

const catalogs = {
  en: { ...enMessages, ...enArtMessages },
  vi: { ...viMessages, ...viArtMessages },
};

function isAppLocale(value: string): value is AppLocale {
  return (LOCALES as readonly string[]).includes(value);
}

export function resolveInitialLocale(): AppLocale {
  try {
    const saved = localStorage.getItem("locale") ?? localStorage.getItem("voyage.locale");
    if (saved && isAppLocale(saved)) return saved;
  } catch {
    /* The preference is optional when browser storage is unavailable. */
  }
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of browserLanguages) {
    const base = tag.split("-")[0];
    if (base && isAppLocale(base)) return base;
  }
  return "en";
}

export function activateLocale(locale: AppLocale) {
  i18n.activate(locale);
  document.documentElement.lang = locale;
}

i18n.load(catalogs);
export function setLocalePreference(locale: AppLocale) {
  try {
    localStorage.setItem("locale", locale);
  } catch {
    /* Changing language still works without persistence. */
  }
  activateLocale(locale);
}

activateLocale(resolveInitialLocale());

export { i18n };
