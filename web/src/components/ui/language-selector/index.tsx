"use client";

import { useLingui } from "@lingui/react/macro";
import Cookie from "js-cookie";
import { useMemo } from "react";

import LanguageSelectorItem from "@web/components/ui/language-selector/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import { dynamicActivate, locales } from "@web/lib/i18n";
import { Cookies } from "@web/lib/utils/constants";
import { cn } from "@web/lib/utils/tailwind";

type LanguageSelectorProps = {
  compact?: boolean;
};

const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
  const { t, i18n } = useLingui();

  const selectedLocale = useMemo(() => {
    return locales.find((locale) => locale.code === i18n.locale) ?? locales[0]!;
  }, [i18n.locale]);

  const handleLanguageChange = (newLocale: string) => {
    void dynamicActivate(newLocale);
    // Set cookie for 10 years.
    Cookie.set(Cookies.Language, newLocale, { expires: 365 * 10 });
  };

  return (
    <div className="relative inline-block">
      <Select
        onValueChange={handleLanguageChange}
        defaultValue={selectedLocale.code}
      >
        <SelectTrigger
          className={cn(
            "border-gray-50 bg-white bg-opacity-50",
            compact ? "h-7 w-14 px-2" : "w-[160px]",
          )}
        >
          <SelectValue
            placeholder={compact ? selectedLocale.emoji : t`Select Language`}
          >
            {compact ? (
              <span>{selectedLocale.emoji}</span>
            ) : (
              <LanguageSelectorItem locale={selectedLocale} />
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <LanguageSelectorItem locale={lang} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
