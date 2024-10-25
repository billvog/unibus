import { z } from "zod";

import { db } from "@api/db";
import { publicProcedure } from "@api/trpc";

export const getBusStopSchedule = publicProcedure
  .input(z.object({ stopId: z.number(), day: z.number() }))
  .query(async ({ input }) => {
    const stopSchedule = await db.query.busStopTime.findMany({
      where: (stopTimes, { and, eq }) =>
        and(eq(stopTimes.stopId, input.stopId), eq(stopTimes.day, input.day)),
      with: {
        busRoute: true,
        busLine: true,
      },
    });

    return stopSchedule;
  });
