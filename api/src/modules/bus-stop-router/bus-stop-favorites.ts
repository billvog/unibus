import { db } from "@api/db";
import { protectedProcedure } from "@api/lib/trpc";

export const busStopFavorites = protectedProcedure.query(async ({ ctx }) => {
  const { userId } = ctx;

  const favorites = await db.query.userFavoriteBusStop.findMany({
    where: (table, { eq }) => eq(table.userId, userId),
    columns: {
      stopId: true,
    },
  });

  return favorites.map((favorite) => favorite.stopId);
});
