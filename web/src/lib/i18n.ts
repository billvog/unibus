import { i18n } from "@lingui/core";
import { detect, fromNavigator, fromCookie } from "@lingui/detect-locale";

export const locales = {
  en: "English",
  el: "Ελληνικά",
};

export const DEFAULT_LOCALE = "el";

/**
 * We do a dynamic import of just the catalog that we need
 * @param locale any locale string
 */
export async function dynamicActivate(locale: string) {
  const { messages } = await import(`@lingui/loader!../locales/${locale}.po`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

/**
 * This function is used to get the default locale from the browser
 * @returns a string with the default locale
 */
export function defaultLocale() {
  const DEFAULT_FALLBACK = () => "en";
  return (
    detect(fromCookie("lang"), fromNavigator(), DEFAULT_FALLBACK) ??
    DEFAULT_FALLBACK()
  );
}

/**
 * This function is used to get the locale from the browser and activate it
 */
export async function activeDefault() {
  const locale = defaultLocale();
  await dynamicActivate(locale);
}
