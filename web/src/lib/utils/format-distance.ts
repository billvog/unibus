import { i18n } from "@lingui/core";

export function formatDistance(meters: number): string {
  const formatter = new Intl.NumberFormat(i18n.locale, {
    style: "unit",
    unit: "kilometer",
    unitDisplay: "short",
    maximumFractionDigits: 1,
  });

  return formatter.format(meters / 1000);
}
