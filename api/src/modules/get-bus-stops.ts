import { db } from "@api/utils/prisma";
import { publicProcedure } from "@api/utils/trpc";

export const getBusStops = publicProcedure.query(async () => {
  const stops = await db.busStop.findMany();
  return stops;
});
