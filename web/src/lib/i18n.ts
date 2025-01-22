import { i18n, type Messages } from "@lingui/core";
import { detect, fromNavigator, fromCookie } from "@lingui/detect-locale";

import { Cookies } from "@web/lib/utils/constants";

export type Locale = {
  emoji: string;
  code: string;
  name: string;
};

export const locales: Locale[] = [
  {
    emoji: "🇺🇸",
    code: "en",
    name: "English",
  },
  {
    emoji: "🇬🇷",
    code: "el",
    name: "Ελληνικά",
  },
];

export const DEFAULT_LOCALE = "en";

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
export async function dynamicActivate(locale: string) {
  const { messages } = (await import(
    `@lingui/loader!../locales/${locale}.po`
  )) as { messages: Messages };

  i18n.load(locale, messages);
  i18n.activate(locale);
}

/**
 * This function is used to get the default locale from the browser
 * @returns a string with the default locale
 */
export function defaultLocale() {
  const DEFAULT_FALLBACK = () => DEFAULT_LOCALE;
  return (
    detect(fromCookie(Cookies.Language), fromNavigator(), DEFAULT_FALLBACK) ??
    DEFAULT_LOCALE
  );
}

/**
 * This function is used to get the locale from the browser and activate it
 */
export async function activeDefault() {
  const locale = defaultLocale();
  await dynamicActivate(locale);
}
