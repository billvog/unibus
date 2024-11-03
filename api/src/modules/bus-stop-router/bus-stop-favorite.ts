import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@api/db";
import { userFavoriteBusStop } from "@api/db/schema";
import { protectedProcedure } from "@api/lib/trpc";

export const busStopFavorite = protectedProcedure
  .input(z.object({ favorite: z.boolean(), stopId: z.number() }))
  .mutation(async ({ input, ctx }) => {
    const { userId } = ctx;

    if (input.favorite) {
      await db
        .insert(userFavoriteBusStop)
        .values({
          userId,
          stopId: input.stopId,
        })
        .onConflictDoNothing({
          target: [userFavoriteBusStop.userId, userFavoriteBusStop.stopId],
        });
    } else {
      await db
        .delete(userFavoriteBusStop)
        .where(
          and(
            eq(userFavoriteBusStop.userId, userId),
            eq(userFavoriteBusStop.stopId, input.stopId)
          )
        );
    }

    return true;
  });
