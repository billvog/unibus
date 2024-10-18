"use server";

import { type BusStopTrip } from "@/types/citybus";
import { CITYBUS_API_URL } from "@/utils/constants";

type GetBusStopScheduleResponse =
  | {
      ok: false;
    }
  | {
      ok: true;
      trips: BusStopTrip[];
    };

export async function GetBusStopSchedule(
  token: string,
  stopCode: string,
  day: number,
): Promise<GetBusStopScheduleResponse> {
  if (
    !token ||
    !stopCode ||
    // Day must be between 1 and 7.
    day < 1 ||
    day > 7
  ) {
    return {
      ok: false,
    };
  }

  const url = `${CITYBUS_API_URL(114)}/trips/stop/${stopCode}/day/${day}`;

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

  const data = (await response.json()) as BusStopTrip[];

  return {
    ok: response.ok,
    trips: data,
  };
}
