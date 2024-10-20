import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { Express } from "express";

import { env } from "@api/env";
import { getBusLinePoints } from "@api/modules/get-bus-line-points";
import { getBusLines } from "@api/modules/get-bus-lines";
import { getBusStopSchedule } from "@api/modules/get-bus-stop-schedule";
import { getBusStops } from "@api/modules/get-bus-stops";
import { IS_PROD } from "@api/utils/constants";
import { createContext, t } from "@api/utils/trpc";

export const appRouter = t.router({
  getBusStops,
  getBusLines,
  getBusLinePoints,
  getBusStopSchedule,
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
