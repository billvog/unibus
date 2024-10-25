import { type Properties } from "posthog-js";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

import { Events } from "@web/utils/constants";

const AnalyticsEventKeys = Object.values(Events.Analytics);

export const useCaptureAnalytics = () => {
  const posthog = usePostHog();

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Properties | null>;
      posthog.capture(event.type, customEvent.detail);
    };

    AnalyticsEventKeys.forEach((eventName) => {
      window.addEventListener(eventName, handler);
    });

    return () => {
      AnalyticsEventKeys.forEach((eventName) => {
        window.removeEventListener(eventName, handler);
      });
    };
  }, [posthog]);
};
