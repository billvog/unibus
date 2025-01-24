import { t } from "@lingui/core/macro";

function displayMinutes(minutes: number) {
  return `${minutes} ${minutes === 1 ? t`minute` : t`minutes`}`;
}

function displaySeconds(seconds: number, compact = false) {
  return (
    `${seconds} ` +
    (compact ? t`sec.` : `${seconds === 1 ? t`second` : t`seconds`}`)
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
