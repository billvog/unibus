"use server";

import { BusStop } from "@/types/citybus";
import { CITYBUS_API_URL } from "@/utils/constants";

type GetBusStopsResponse =
  | {
      ok: false;
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
    };
  }

  const data: BusStop[] = await response.json();

  return {
    ok: response.ok,
    stops: data,
  };
}
