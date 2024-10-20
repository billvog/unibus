import { db } from "@api/utils/prisma";
import { publicProcedure } from "@api/utils/trpc";

export const getBusLines = publicProcedure.query(async () => {
  const lines = await db.busLine.findMany();
  return lines;
});
