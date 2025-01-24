import { i18n, type Messages } from "@lingui/core";
import { detect, fromNavigator, fromCookie } from "@lingui/detect-locale";

import { setDayLocale } from "@web/lib/day";
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
  // Load messages for locale
  const { messages } = (await import(
    `@lingui/loader!../locales/${locale}.po`
  )) as { messages: Messages };

  // Load and activate
  i18n.load(locale, messages);
  i18n.activate(locale);

  // Set the dayjs locale
  setDayLocale(locale);
}

/**
 * This function is used to get the default (or preferred) locale from the browser
 * @returns a string with the detected locale
 */
export function detectedLocale() {
  const DEFAULT_FALLBACK = () => DEFAULT_LOCALE;

  const detected =
    detect(fromCookie(Cookies.Language), fromNavigator(), DEFAULT_FALLBACK) ??
    DEFAULT_LOCALE;

  // Convert potential "en-US" format to "en"
  return detected.split("-")[0] ?? detected;
}

/**
 * This function is used to get the locale from the browser and activate it
 */
export async function activeDefault() {
  const locale = detectedLocale();
  await dynamicActivate(locale);
}
