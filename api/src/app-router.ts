import * as trpcExpress from "@trpc/server/adapters/express";
import { Express } from "express";

import { createContext, t } from "@api/lib/trpc";
import { getBusLinePoints } from "@api/modules/get-bus-line-points";
import { getBusLines } from "@api/modules/get-bus-lines";
import { getBusLiveStop } from "@api/modules/get-bus-live-stop";
import { getBusStop } from "@api/modules/get-bus-stop";
import { getBusStopSchedule } from "@api/modules/get-bus-stop-schedule";
import { getBusStops } from "@api/modules/get-bus-stops";
import { searchBusStop } from "@api/modules/search-bus-stop";
import { userRouter } from "@api/modules/user-router";

export const appRouter = t.router({
  searchBusStop,
  getBusStop,
  getBusStops,
  getBusLines,
  getBusLinePoints,
  getBusStopSchedule,
  getBusLiveStop,
  user: userRouter,
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
