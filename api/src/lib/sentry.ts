import { env } from "@api/env";
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: env.SENTRY_DSN,
  environment: env.NODE_ENV,
  release: env.SENTRY_RELEASE,
  enabled: env.NODE_ENV === "production",
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// Manually start the profiler
Sentry.profiler.startProfiler();
