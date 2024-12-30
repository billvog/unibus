import * as trpcExpress from "@trpc/server/adapters/express";
import { Express } from "express";

import { createContext, t } from "@api/lib/trpc";
import { busStopRouter } from "@api/modules/bus-stop-router";
import { getBusLinePoints } from "@api/modules/get-bus-line-points";
import { getBusLines } from "@api/modules/get-bus-lines";
import { getBusLiveStop } from "@api/modules/get-bus-live-stop";
import { getBusStopSchedule } from "@api/modules/get-bus-stop-schedule";
import { getBusStops } from "@api/modules/get-bus-stops";
import { hasSupportedAgency } from "@api/modules/has-supported-agency";
import { searchBusStop } from "@api/modules/search-bus-stop";
import { userRouter } from "@api/modules/user-router";

export const appRouter = t.router({
  hasSupportedAgency,
  searchBusStop,
  getBusStops,
  getBusLines,
  getBusLinePoints,
  getBusStopSchedule,
  getBusLiveStop,
  user: userRouter,
  busStop: busStopRouter,
});

export function addTrpc(app: Express) {
  app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
}

export type AppRouter = typeof appRouter;
