"use server";

import { type BusLine } from "@web/types/citybus";
import { CITYBUS_API_URL } from "@web/utils/constants";

export type GetBusLinesResponse =
  | {
      ok: false;
    }
  | {
      ok: true;
      lines: BusLine[];
    };

export async function GetBusLines(token: string): Promise<GetBusLinesResponse> {
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

  const data = (await response.json()) as BusLine[];

  return {
    ok: response.ok,
    lines: data,
  };
}
