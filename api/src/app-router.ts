import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { Express } from "express";

import { env } from "@api/env";
import { getBusLinePoints } from "@api/modules/get-bus-line-points";
import { getBusLines } from "@api/modules/get-bus-lines";
import { getBusLiveStop } from "@api/modules/get-bus-live-stop";
import { getBusStopSchedule } from "@api/modules/get-bus-stop-schedule";
import { getBusStops } from "@api/modules/get-bus-stops";
import { IS_PROD } from "@api/utils/constants";
import { createContext, t } from "@api/utils/trpc";
import { getBusStop } from "@api/modules/get-bus-stop";

export const appRouter = t.router({
  getBusStop,
  getBusStops,
  getBusLines,
  getBusLinePoints,
  getBusStopSchedule,
  getBusLiveStop,
});

export function addTrpc(app: Express) {
  app.use(
    "/trpc",
    cors({
      maxAge: IS_PROD ? 86400 : undefined,
      origin: env.FRONTEND_URL,
    }),
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
}

export type AppRouter = typeof appRouter;
