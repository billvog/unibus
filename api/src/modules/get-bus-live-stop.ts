import { AxiosError } from "axios";
import { z } from "zod";

import { db } from "@api/db";
import { citybusClient } from "@api/lib/axios";
import { publicProcedure } from "@api/lib/trpc";
import { GetBusLiveStopAPIResponse } from "@api/types/citybus";

export const getBusLiveStop = publicProcedure
  .input(z.object({ stopId: z.number() }))
  .query(async ({ input }) => {
    try {
      const stop = await db.query.busStop.findFirst({
        where: ({ id }, { eq }) => eq(id, input.stopId),
      });

      if (!stop) {
        return { ok: false as const };
      }

      const agency = await db.query.agency.findFirst({
        where: ({ id }, { eq }) => eq(id, stop.agencyId),
      });

      if (!agency) {
        return { ok: false as const };
      }

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
