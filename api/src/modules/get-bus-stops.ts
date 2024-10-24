import { db } from "@api/db";
import { publicProcedure } from "@api/utils/trpc";

export const getBusStops = publicProcedure.query(async () => {
  const stops = await db.query.busStop.findMany({
    with: {
      busLines: {
        with: {
          busLine: true,
        },
      },
    },
  });

  return stops;
});
