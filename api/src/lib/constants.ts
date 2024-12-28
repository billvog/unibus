import { env } from "@api/env";

export const IsProd = env.NODE_ENV === "production";

export const GetCitybusWebsiteURL = (city: string) =>
  `https://${city}.citybus.gr/el`;

export const CitybusAPIURL = "https://rest.citybus.gr/api/v1/el";

export const Cookies = {
  Auth: {
    AccessToken: "access-token",
    RefreshToken: "refresh-token",
  },
};
