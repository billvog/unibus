import { generateCitybusToken } from "@api/utils/citybus-token";
import cron from "node-cron";

export function registerCronJobs() {
  // Generate a new Citybus token on startup
  generateCitybusToken();

  // Generate a new Citybus token every day at midnight
  cron.schedule("0 0 * * *", () => generateCitybusToken(), {
    name: "generate-citybus-token",
    timezone: "Europe/Athens",
  });
}
