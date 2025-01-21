/**
 * Returns an array of days in the given locale.
 */
export const getDaysInLocale = (locale: string) => {
  const format = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const days = [];

  // Start from Monday (1) to Sunday (7)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(2024, 0, i); // Using first week of 2024 (starts with Monday)
    days.push(format.format(date));
  }

  return days;
};
