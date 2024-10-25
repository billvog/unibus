import { fetchStaticCitybusFeed } from "@api/utils/citybus/fetch-static-feed";
import { generateCitybusToken } from "@api/utils/citybus/token";

void (async () => {
  await generateCitybusToken();
  void fetchStaticCitybusFeed();
})();
