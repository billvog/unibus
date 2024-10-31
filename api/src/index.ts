import "@api/lib/axios";
import path from "path";

import cors from "cors";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import Express from "express";
import rateLimit from "express-rate-limit";
import { MemcachedStore } from "rate-limit-memcached";

import { addTrpc } from "@api/app-router";
import { db } from "@api/db";
import { env } from "@api/env";
import { IS_PROD } from "@api/lib/constants";
import { addPassport } from "@api/lib/passport";
import { registerCronJobs } from "@api/lib/register-cron-jobs";

const __dirname = import.meta.dirname;

async function main() {
  const app = Express();

  // Only run on production
  if (IS_PROD) {
    // Migrate the database
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../drizzle"),
    });

    // Use the trust proxy middleware
    app.set("trust proxy", 1);
  }

  void registerCronJobs();

  // Disable the x-powered-by header
  app.disable("x-powered-by");

  // Enable CORS
  app.use(
    cors({
      maxAge: IS_PROD ? 86400 : undefined,
      origin: env.FRONTEND_URL,
    })
  );

  // Limit each IP to 100 requests per minute
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
      legacyHeaders: !IS_PROD, // Disable rate limit headers on prod
      store: new MemcachedStore({
        prefix: "rl:",
        locations: [env.MEMCACHED_URL.replace("memcached://", "")],
      }),
    })
  );

  // Register our modules
  addTrpc(app);
  addPassport(app);

  // Start the server
  app.listen(env.PORT, () => {
    console.log(`🚀 Server started at ${env.PORT}`);
  });
}

void main();
