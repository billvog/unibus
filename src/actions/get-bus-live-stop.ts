"use server";

import { BusVehicle } from "@/types/citybus";
import { CITYBUS_API_URL } from "@/utils/constants";
import { NextResponse } from "next/server";

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
    // API returns 404 if no router are found.
    if (response.status === 404) {
      return {
        ok: true,
        vehicles: [],
      };
    }

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
