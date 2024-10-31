import "@api/lib/axios";
import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import Express from "express";
import rateLimit from "express-rate-limit";
import { MemcachedStore } from "rate-limit-memcached";

import { addTrpc } from "@api/app-router";
import { db } from "@api/db";
import { env } from "@api/env";
import { IsProd } from "@api/lib/constants";
import { addPassport } from "@api/lib/passport";
import { registerCronJobs } from "@api/lib/register-cron-jobs";

const __dirname = import.meta.dirname;

async function main() {
  const app = Express();

  // Only run on production
  if (IsProd) {
    // Migrate the database
    await migrate(db, {
      migrationsFolder: path.join(__dirname, "../drizzle"),
    });

    // Use the trust proxy middleware
    app.set("trust proxy", 1);
  }

  registerCronJobs();

  // Disable the x-powered-by header
  app.disable("x-powered-by");

  // Enable CORS
  app.use(
    cors({
      maxAge: IsProd ? 86400 : undefined,
      origin: env.FRONTEND_URL,
    })
  );

  // Parse Cookies
  app.use(cookieParser());

  // Limit each IP to 100 requests per minute
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
      legacyHeaders: !IsProd, // Disable rate limit headers on prod
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
