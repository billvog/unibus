import { z } from "zod";

import { db } from "@api/utils/prisma";
import { publicProcedure } from "@api/utils/trpc";

export const getBusStopSchedule = publicProcedure
  .input(z.object({ stopId: z.number(), day: z.number() }))
  .query(async ({ input }) => {
    const stopSchedule = await db.busStopTrip.findMany({
      where: {
        stopId: input.stopId,
        day: input.day,
      },
    });

    return stopSchedule;
  });
