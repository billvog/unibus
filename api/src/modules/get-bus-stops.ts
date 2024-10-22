import { db } from "@api/db";
import { publicProcedure } from "@api/utils/trpc";

export const getBusStops = publicProcedure.query(async () => {
  const stops = await db.query.busStop.findMany({
    columns: {
      id: true,
      code: true,
      location: true,
    },
  });

  return stops;
});
