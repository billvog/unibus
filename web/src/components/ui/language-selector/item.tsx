import React from "react";

import { type Locale } from "@web/lib/i18n";

type LanguageSelectorItemProps = {
  locale: Locale;
};

const LanguageSelectorItem = ({ locale }: LanguageSelectorItemProps) => {
  return (
    <div className="flex items-center">
      <span className="mr-2">{locale.emoji}</span>
      {locale.name}
    </div>
  );
};

export default LanguageSelectorItem;
