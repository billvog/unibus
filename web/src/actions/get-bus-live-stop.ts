"use server";

import { type BusVehicle } from "@web/types/citybus";
import { CITYBUS_API_URL } from "@web/utils/constants";

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const data = (await response.json()).vehicles as BusVehicle[];

  return {
    ok: response.ok,
    vehicles: data,
  };
}
