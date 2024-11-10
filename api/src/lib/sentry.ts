import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://7e28a727e9dbd301f24f521dbaee703f@o4508275271401472.ingest.de.sentry.io/4508275378618448",
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});

// Manually start the profiler
Sentry.profiler.startProfiler();
