"use server";

import { BusVehicle } from "@/types/citybus";
import { CITYBUS_API_URL } from "@/utils/constants";

type GetBusLiveStopResponse =
  | {
      ok: false;
    }
  | {
      ok: true;
      vehicles: BusVehicle[];
    };

export async function GetBusLiveStop(
  token: string,
  stopCode: string,
): Promise<GetBusLiveStopResponse> {
  if (!token || !stopCode) {
    return {
      ok: false,
    };
  }

  const url = `${CITYBUS_API_URL(114)}/stops/live/${stopCode}`;

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

  const data: BusVehicle[] = (await response.json()).vehicles;

  return {
    ok: response.ok,
    vehicles: data,
  };
}
