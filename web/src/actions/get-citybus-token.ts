"use server";

import { CITYBUS_WEBSITE_URL } from "@/utils/constants";

type GetCitybusTokenResponse =
  | {
      ok: false;
    }
  | {
      ok: true;
      token: string;
    };

export async function GetCitybusToken(): Promise<GetCitybusTokenResponse> {
  const url = `${CITYBUS_WEBSITE_URL("lamia")}/stops`;

  const response = await fetch(url);
  const responseText = await response.text();

  if (!response.ok) {
    return {
      ok: false,
    };
  }

  const regex = /const token = '([^']+)';/;
  const match = regex.exec(responseText);

  if (!match?.[1]) {
    return {
      ok: false,
    };
  }

  const token = match[1];
  console.log("Extracted Token:", token);

  return {
    ok: true,
    token,
  };
}
