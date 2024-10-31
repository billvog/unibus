import { env } from "@api/env";

export const IS_PROD = env.NODE_ENV === "production";

export const CITYBUS_WEBSITE_URL = (city: string) =>
  `https://${city}.citybus.gr/el`;

export const CITYBUS_API_URL = (agencyCode: number) =>
  `https://rest.citybus.gr/api/v1/el/${agencyCode}`;
