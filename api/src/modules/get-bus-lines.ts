import { db } from "@api/db";
import { publicProcedure } from "@api/lib/trpc";

export const getBusLines = publicProcedure.query(async () => {
  const lines = await db.query.busLine.findMany();
  return lines;
});
