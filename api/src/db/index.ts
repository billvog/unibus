import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@api/db/schema";
import { env } from "@api/env";
import { IS_PROD } from "@api/lib/constants";

export const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: !IS_PROD, // Logger only in development
});
