import "dayjs/locale/el";
import "dayjs/locale/en";

import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// Register plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);

export const setDayLocale = (locale: string) => {
  dayjs.locale(locale);
};
