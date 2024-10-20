import cron from "node-cron";

import { generateCitybusToken } from "@api/utils/citybus/token";
import { fetchStaticCitybusFeed } from "@api/utils/citybus/fetch-static-feed";

export const registerCronJobs = async () => {
  // Generate a new Citybus token on startup
  await generateCitybusToken();

  // Generate a new Citybus token every day at midnight
  cron.schedule("0 0 * * *", () => void generateCitybusToken(), {
    name: "generate-citybus-token",
    timezone: "Europe/Athens",
  });

  // Refetch the static Citybus feed every month at midnight
  cron.schedule("0 0 1 * *", () => void fetchStaticCitybusFeed(), {
    name: "generate-citybus-token",
    timezone: "Europe/Athens",
  });
};
