import "dayjs/locale/el";

import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

// Set global locale
dayjs.locale("el");

// Register plugins
dayjs.extend(duration);
dayjs.extend(relativeTime);
