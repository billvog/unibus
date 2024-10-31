import { fetchStaticCitybusFeed } from "@api/lib/citybus/fetch-static-feed";
import { generateCitybusToken } from "@api/lib/citybus/token";

void (async () => {
  await generateCitybusToken();
  void fetchStaticCitybusFeed();
})();
