"use server";

import { BusLine } from "@/types/citybus";
import { CITYBUS_API_URL } from "@/utils/constants";

type GetBusLinesResponse =
  | {
      ok: false;
    }
  | {
      ok: true;
      lines: BusLine[];
    };

export async function GetLinesStops(
  token: string,
): Promise<GetBusLinesResponse> {
  const url = `${CITYBUS_API_URL(114)}/lines`;

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

  const data: BusLine[] = await response.json();

  return {
    ok: response.ok,
    lines: data,
  };
}
