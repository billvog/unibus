import { t, plural } from "@lingui/core/macro";

function displayMinutes(minutes: number) {
  return plural(minutes, {
    one: "# minute",
    other: "# minutes",
  });
}

function displaySeconds(seconds: number, compact = false) {
  return (
    `${seconds} ` +
    (compact ? t`sec.` : plural(seconds, { one: "second", other: "seconds" }))
  );
}

export function formatTime(minutes: number, seconds: number) {
  if (minutes > 1) {
    return displayMinutes(minutes);
  }

  if (minutes === 1) {
    return [
      displayMinutes(minutes),
      t`and`,
      displaySeconds(seconds, true),
    ].join(" ");
  }

  return displaySeconds(seconds);
}
