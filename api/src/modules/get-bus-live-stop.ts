import { AxiosError } from "axios";
import { z } from "zod";

import { GetBusLiveStopAPIResponse } from "@api/types/citybus";
import { citybusClient } from "@api/utils/axios";
import { publicProcedure } from "@api/trpc";

export const getBusLiveStop = publicProcedure
  .input(z.object({ stopCode: z.string() }))
  .query(async ({ input }) => {
    try {
      const response = await citybusClient.get<GetBusLiveStopAPIResponse>(
        `/stops/live/${input.stopCode}`
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
