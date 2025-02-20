import { z } from "zod";

import { db } from "@api/db";
import { publicProcedure } from "@api/lib/trpc";

export const getBusLinePoints = publicProcedure
  .input(z.object({ lineId: z.number() }))
  .query(async ({ input }) => {
    const linesPoints = await db.query.busLinePoint.findMany({
      where: (points, { eq }) => eq(points.lineId, input.lineId),
      columns: {
        id: true,
        location: true,
        sequence: true,
      },
    });

    return linesPoints;
  });
