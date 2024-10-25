import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@api/db/schema";
import { env } from "@api/env";

export const db = drizzle(env.DATABASE_URL, { schema, logger: true });
