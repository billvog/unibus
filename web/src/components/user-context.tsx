"use client";

import type { DbUser } from "@api/types/models";
import React, { createContext, useContext, useState } from "react";

import { trpc } from "@web/lib/trpc";
import { useIdentifyUser } from "@web/hooks/use-identify-user";

interface UserContextType {
  user: DbUser | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType["user"]>(null);

  const { data: userData, isLoading } = trpc.user.me.useQuery();

  // Identify user to thrid-party services
  useIdentifyUser(isLoading, userData ?? null);

  React.useEffect(() => {
    setUser(userData ?? null);
  }, [userData]);

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
