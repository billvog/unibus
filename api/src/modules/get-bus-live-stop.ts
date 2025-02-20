import { AxiosError } from "axios";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

import { db } from "@api/db";
import * as schema from "@api/db/schema";
import { citybusClient } from "@api/lib/axios";
import { client as redisClient } from "@api/lib/redis";
import { publicProcedure } from "@api/lib/trpc";
import { GetBusLiveStopAPIResponse } from "@api/types/citybus";

type CachedDetails = {
  stop: InferSelectModel<typeof schema.busStop>;
  agency: InferSelectModel<typeof schema.agency>;
};

/**
 * Given a stop id, fetches and caches the stop code and agency code
 * required to make a request to the Citybus API.
 */
const getCachedStopDetails = async (
  stopId: number
): Promise<CachedDetails | null> => {
  const cached = await redisClient.get(`getBusLiveStop:${stopId}`);

  if (cached) {
    try {
      return JSON.parse(cached) as CachedDetails;
    } catch (error) {
      console.error(error);
    }
  }

  const stop = await db.query.busStop.findFirst({
    where: ({ id }, { eq }) => eq(id, stopId),
  });

  if (!stop) {
    return null;
  }

  const agency = await db.query.agency.findFirst({
    where: ({ id }, { eq }) => eq(id, stop.agencyId),
  });

  if (!agency) {
    return null;
  }

  await redisClient.set(
    `getBusLiveStop:${stopId}`,
    JSON.stringify({ stop, agency }),
    "EX",
    60
  );

  return { stop, agency };
};

export const getBusLiveStop = publicProcedure
  .input(z.object({ stopId: z.number() }))
  .query(async ({ input }) => {
    const cached = await getCachedStopDetails(input.stopId);
    if (!cached) {
      return { ok: false as const };
    }

    const { stop, agency } = cached;

    try {
      const response = await citybusClient.get<GetBusLiveStopAPIResponse>(
        `/${agency.code}/stops/live/${stop.code}`
      );

      const vehicles = response.data.vehicles;
      return { ok: true as const, vehicles };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return { ok: true as const, vehicles: [] };
      }
    }

    return { ok: false as const };
  });
