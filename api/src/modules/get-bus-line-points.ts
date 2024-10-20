import { z } from "zod";

import { db } from "@api/utils/prisma";
import { publicProcedure } from "@api/utils/trpc";

export const getBusLinePoints = publicProcedure
  .input(z.object({ lineCode: z.string() }))
  .query(async ({ input }) => {
    const linesPoints = await db.busLinePoint.findMany({
      where: {
        line: {
          code: input.lineCode,
        },
      },
    });

    return linesPoints;
  });
