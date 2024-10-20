import { z } from "zod";

import { db } from "@api/utils/prisma";
import { publicProcedure } from "@api/utils/trpc";

export const getBusLinePoints = publicProcedure
  .input(z.object({ lineId: z.number() }))
  .query(async ({ input }) => {
    const linesPoints = await db.busLinePoint.findMany({
      where: {
        lineId: input.lineId,
      },
    });

    return linesPoints;
  });
