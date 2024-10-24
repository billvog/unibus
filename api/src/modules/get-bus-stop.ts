import { db } from "@api/db";
import { publicProcedure } from "@api/utils/trpc";
import { z } from "zod";

export const getBusStop = publicProcedure
  .input(z.object({ stopId: z.number() }))
  .query(async ({ input }) => {
    const stop = await db.query.busStop.findFirst({
      where: ({ id }, { eq }) => eq(id, input.stopId),
      with: {
        busLines: {
          with: {
            busLine: true,
          },
        },
      },
    });

    return stop;
  });
