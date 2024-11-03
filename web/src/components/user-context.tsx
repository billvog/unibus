import type { DbUser } from "@api/types/models";
import posthog from "posthog-js";
import React, { createContext, useContext, useState } from "react";

import { trpc } from "@web/lib/trpc";

interface UserContextType {
  user: DbUser | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType["user"]>(null);

  const { data: userData, isLoading } = trpc.user.me.useQuery();

  React.useEffect(() => {
    setUser(userData ?? null);
  }, [userData]);

  // Identify user in PostHog, using their unique ID
  React.useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!user) {
      posthog.reset();
    }

    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
      });
    }
  }, [user, isLoading]);

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
