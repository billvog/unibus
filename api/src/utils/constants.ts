import { env } from "@api/env";

export const IS_PROD = env.NODE_ENV === "production";
