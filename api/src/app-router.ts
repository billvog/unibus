import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { Express } from "express";

import { env } from "@api/env";
import { getBusStops } from "@api/modules/get-bus-stops";
import { createContext, t } from "@api/trpc";
import { IS_PROD } from "@api/utils/constants";

export const appRouter = t.router({
  getBusStops,
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
