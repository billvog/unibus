"use client";

import { i18n } from "@lingui/core";

import { usePersistedState } from "@web/hooks/use-persisted-state";
import { Cookies } from "@web/lib/utils/constants";

export const useLanguage = () =>
  usePersistedState<string | null>(Cookies.Language, i18n.locale, {
    storage: "cookies",
    format: "string",
  });
