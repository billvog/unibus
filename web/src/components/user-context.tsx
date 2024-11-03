import type { DbUser } from "@api/types/models";
import { createContext, useContext, useEffect, useState } from "react";

import { trpc } from "@web/lib/trpc";

interface UserContextType {
  user: DbUser | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType["user"]>(null);

  const { data: userData } = trpc.user.me.useQuery();

  useEffect(() => {
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
