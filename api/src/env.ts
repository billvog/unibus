import { createEnv } from "@t3-oss/env-core";
import { config } from "dotenv-safe";
import { z } from "zod";

config({
  allowEmptyValues: true,
});

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    DOMAIN: z.string().optional(),
    PORT: z.string().default("8000"),
    // Services
    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),
    // URLs
    FRONTEND_URL: z.string(),
    BACKEND_URL: z.string(),
    // Auth Token
    ACCESS_TOKEN_SECRET: z.string(),
    REFRESH_TOKEN_SECRET: z.string(),
    // OAuth
    OAUTH_GOOGLE_CLIENT_ID: z.string(),
    OAUTH_GOOGLE_CLIENT_SECRET: z.string(),
    OAUTH_GOOGLE_SCOPES: z.string(),
    // PostHog
    POSTHOG_KEY: z.string().optional(),
    POSTHOG_HOST: z.string().optional(),
    // Sentry
    SENTRY_DSN: z.string(),
    SENTRY_RELEASE: z.string().optional(),
  },

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
});
