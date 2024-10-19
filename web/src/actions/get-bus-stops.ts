"use server";

import { type BusStop } from "@web/types/citybus";
import { CITYBUS_API_URL } from "@web/utils/constants";

type GetBusStopsResponse =
  | {
      ok: false;
      status?: number;
    }
  | {
      ok: true;
      stops: BusStop[];
    };

export async function GetBusStops(token: string): Promise<GetBusStopsResponse> {
  if (!token) {
    return {
      ok: false,
    };
  }

  const url = `${CITYBUS_API_URL(114)}/stops`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
    };
  }

  const data = (await response.json()) as BusStop[];

  return {
    ok: response.ok,
    stops: data,
  };
}
