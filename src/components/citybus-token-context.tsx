"use client";

import { GetCitybusToken } from "@/actions/get-citybus-token";
import { usePersistedState } from "@/hooks/usePersistedState";
import { StorageKeys } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const CitybusTokenContext = React.createContext<string | null>(null);

export const CitybusTokenProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken, initialized] = usePersistedState<string | null>(
    StorageKeys.CitybusToken,
    null,
  );

  const tokenQuery = useQuery({
    queryKey: ["token"],
    queryFn: () => GetCitybusToken(),
    enabled: false,
  });

  React.useEffect(() => {
    if (initialized && !token) {
      tokenQuery.refetch();
    }
  }, [token, initialized]);

  React.useEffect(() => {
    if (tokenQuery.data?.ok) {
      setToken(tokenQuery.data.token);
    }
  }, [tokenQuery.data]);

  return (
    <CitybusTokenContext.Provider value={token}>
      {children}
    </CitybusTokenContext.Provider>
  );
};

export const useCitybusToken = () => {
  return React.useContext(CitybusTokenContext);
};
