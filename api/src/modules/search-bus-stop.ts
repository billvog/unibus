import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@api/db";
import { agency, busLine, busStop, busStopToLine } from "@api/db/schema";
import { publicProcedure } from "@api/lib/trpc";
import { DbSearchedBusStop } from "@api/types/models";

export const searchBusStop = publicProcedure
  .input(z.object({ term: z.string().min(1) }))
  .query(async ({ input }) => {
    const matchQuery = sql`(
      setweight(to_tsvector('greek', ${busStop.name}), 'A') || 
      setweight(to_tsvector('greek', ${busStop.code}), 'B')
    ), plainto_tsquery('greek', ${input.term})`;

    const stops = await db
      .select({
        agency: {
          id: agency.id,
          code: agency.code,
          name: agency.name,
          nativeName: agency.nativeName,
          location: agency.location,
        },
        busStop: getTableColumns(busStop),
        busStopToLine: getTableColumns(busStopToLine),
        busLine: getTableColumns(busLine),
        rank: sql<number>`ts_rank(${matchQuery})`,
      })
      .from(busStop)
      .where(
        sql`(
          setweight(to_tsvector('greek', ${busStop.name}), 'A') || 
          setweight(to_tsvector('greek', ${busStop.code}), 'B')
        ) @@ plainto_tsquery('greek', ${input.term})`
      )
      .innerJoin(agency, eq(busStop.agencyId, agency.id))
      .innerJoin(busStopToLine, eq(busStop.id, busStopToLine.stopId))
      .innerJoin(busLine, eq(busLine.id, busStopToLine.lineId))
      .orderBy((t) => desc(t.rank))
      .limit(5);

    // Because we fetch a many-to-many relation, we need to format the
    // data to a more usable format, having bus lines in an array.
    const formattedStops = stops.reduce<DbSearchedBusStop[]>((acc, curr) => {
      const stop = acc.find((s) => s.id === curr.busStop.id);
      const stopToLine = {
        ...curr.busStopToLine,
        busLine: curr.busLine,
      };

      if (stop) {
        stop.busLines.push(stopToLine);
      } else {
        acc.push({
          ...curr.busStop,
          agency: curr.agency,
          busLines: [stopToLine],
          rank: curr.rank,
        });
      }

      return acc;
    }, []);

    return formattedStops satisfies DbSearchedBusStop[];
  });
