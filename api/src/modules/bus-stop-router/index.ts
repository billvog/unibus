import { t } from "@api/lib/trpc";
import { busStopFavorite } from "@api/modules/bus-stop-router/bus-stop-favorite";
import { busStopFavorites } from "@api/modules/bus-stop-router/bus-stop-favorites";
import { getBusStop } from "@api/modules/bus-stop-router/get-bus-stop";

export const busStopRouter = t.router({
  get: getBusStop,
  favorite: busStopFavorite,
  favorites: busStopFavorites,
});
