"use client";

import { useLingui } from "@lingui/react/macro";
import { useMemo } from "react";

import LanguageSelectorItem from "@web/components/ui/language-selector/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web/components/ui/select";
import { useLanguage } from "@web/hooks/use-language";
import { dynamicActivate, locales } from "@web/lib/i18n";
import { cn } from "@web/lib/utils/tailwind";

type LanguageSelectorProps = {
  compact?: boolean;
};

const LanguageSelector = ({ compact = false }: LanguageSelectorProps) => {
  const { t } = useLingui();

  const [language, setLanguage] = useLanguage();

  const selectedLocale = useMemo(() => {
    return locales.find((locale) => locale.code === language) ?? locales[0]!;
  }, [language]);

  const handleLanguageChange = (newLocale: string) => {
    void dynamicActivate(newLocale);
    setLanguage(newLocale);
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
