import { fetchStaticCitybusFeed } from "@api/utils/citybus/fetch-static-feed";
import { generateCitybusToken } from "@api/utils/citybus/token";

(async () => {
  await generateCitybusToken();
  void fetchStaticCitybusFeed();
})();
