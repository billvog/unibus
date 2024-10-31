import cron from "node-cron";

import { fetchStaticCitybusFeed } from "@api/lib/citybus/fetch-static-feed";
import { generateCitybusToken } from "@api/lib/citybus/token";

export const registerCronJobs = async () => {
  // Generate a new Citybus token every day at midnight
  cron.schedule("0 0 * * *", () => void generateCitybusToken(), {
    runOnInit: true,
    name: "generate-citybus-token",
    timezone: "Europe/Athens",
  });

  // Refetch the static Citybus feed every month at midnight
  cron.schedule("0 0 1 * *", () => void fetchStaticCitybusFeed(), {
    name: "fetch-static-citybus-feed",
    timezone: "Europe/Athens",
    scheduled: false, // disable for now
  });
};
