import { DbUser } from "@api/types/models";
import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";
import React from "react";

// Identify user in PostHog & Sentry, using their unique ID
export const useIdentifyUser = (isLoading: boolean, user: DbUser | null) => {
  const identifyUser = React.useCallback((u: DbUser) => {
    posthog.identify(u.id, {
      email: u.email,
      name: u.name,
    });

    Sentry.setUser({
      id: u.id,
      email: u.email,
      username: u.name,
    });
  }, []);

  const resetUser = React.useCallback(() => {
    posthog.reset();
    Sentry.setUser(null);
  }, []);

  React.useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      resetUser();
      return;
    }

    identifyUser(user);
  }, [user, isLoading, identifyUser, resetUser]);
};
