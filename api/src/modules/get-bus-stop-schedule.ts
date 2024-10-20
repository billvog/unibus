import { z } from "zod";

import { db } from "@api/utils/prisma";
import { publicProcedure } from "@api/utils/trpc";

export const getBusStopSchedule = publicProcedure
  .input(z.object({ stopId: z.number() }))
  .query(async ({ input }) => {
    const stopSchedule = await db.busStopTrip.findMany({
      where: {
        stopId: input.stopId,
      },
    });

    return stopSchedule;
  });
