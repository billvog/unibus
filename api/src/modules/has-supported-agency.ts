import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@api/db";
import * as schema from "@api/db/schema";
import { publicProcedure } from "@api/lib/trpc";

export const hasSupportedAgency = publicProcedure
  .input(
    z.object({
      location: z.object({
        x: z.number(),
        y: z.number(),
      }),
    })
  )
  .query(async ({ input }) => {
    const agency = await db
      .select()
      .from(schema.agency)
      .where(
        sql`ST_Contains(${sql.identifier("polygon")}, ST_SetSRID(ST_MakePoint(${input.location.x}, ${input.location.y}), 4326))`
      )
      .limit(1);

    return agency.length > 0;
  });
