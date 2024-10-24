import "@api/utils/axios";
import path from "path";

import { migrate } from "drizzle-orm/node-postgres/migrator";
import Express from "express";

import { addTrpc } from "@api/app-router";
import { db } from "@api/db";
import { env } from "@api/env";
import { IS_PROD } from "@api/utils/constants";
import { registerCronJobs } from "@api/utils/register-cron-jobs";

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

  addTrpc(app);

  app.listen(env.PORT, () => {
    console.log(`🚀 Server started at ${env.PORT}`);
  });
}

void main();
