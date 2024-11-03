import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@api/db/schema";
import { env } from "@api/env";
import { IsProd } from "@api/lib/constants";

export const db = drizzle(env.DATABASE_URL, {
  schema,
  logger: !IsProd, // Logger only in development
});
