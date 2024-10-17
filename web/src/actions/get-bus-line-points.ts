"use server";

import { type BusLinePoint } from "@/types/citybus";
import { CITYBUS_API_URL } from "@/utils/constants";

// The response we get from Citybus API
type GetBusLinePointsAPIResponse = {
  routeCode: string;
  routePoints: BusLinePoint[];
}[];

// The response we return from this function
type GetBusLinePointsResponse =
  | {
      ok: false;
    }
  | {
      ok: true;
      linePoints: BusLinePoint[];
    };

export async function GetBusLinePoints(
  token: string,
  lineCode: string,
): Promise<GetBusLinePointsResponse> {
  if (!token || !lineCode) {
    return {
      ok: false,
    };
  }

  const url = `${CITYBUS_API_URL(114)}/lines/${lineCode}/points`;

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

  const data = (await response.json()) as GetBusLinePointsAPIResponse;

  return {
    ok: response.ok,
    linePoints: data[0]?.routePoints ?? [],
  };
}
