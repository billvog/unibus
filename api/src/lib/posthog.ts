import { PostHog } from "posthog-node";

import { env } from "@api/env";

export const posthog = new PostHog(env.POSTHOG_KEY ?? "", {
  host: env.POSTHOG_HOST,
  disabled: !env.POSTHOG_KEY,
});
