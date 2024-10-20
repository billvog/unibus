import cron from "node-cron";

import { generateCitybusToken } from "@api/utils/citybus-token";

export function registerCronJobs() {
  // Generate a new Citybus token on startup
  void generateCitybusToken();

  // Generate a new Citybus token every day at midnight
  cron.schedule("0 0 * * *", () => void generateCitybusToken(), {
    name: "generate-citybus-token",
    timezone: "Europe/Athens",
  });
}
