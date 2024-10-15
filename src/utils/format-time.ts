function displayMinutes(minutes: number) {
  return `${minutes} λεπτ${minutes === 1 ? "ό" : "ά"}`;
}

function displaySeconds(seconds: number, compact = false) {
  return (
    `${seconds} δευτ` + (compact ? "." : `ερόλεπτ${seconds === 1 ? "ο" : "α"}`)
  );
}

export function formatTime(minutes: number, seconds: number) {
  if (minutes > 1) {
    return displayMinutes(minutes);
  }

  if (minutes === 1) {
    return displayMinutes(minutes) + " και " + displaySeconds(seconds, true);
  }

  return displaySeconds(seconds);
}
