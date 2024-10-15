"use client";

import { GetCitybusToken } from "@/actions/get-citybus-token";
import { usePersistedState } from "@/hooks/usePersistedState";
import { StorageKeys } from "@/utils/constants";
import { VerifyJwt } from "@/utils/verify-jwt";
import { useQuery } from "@tanstack/react-query";
import React from "react";

type CitybusTokenContextType = {
  token: string | null;
  refetchToken: () => void;
};

const CitybusTokenContext = React.createContext<CitybusTokenContextType>({
  token: null,
  refetchToken: () => {},
});

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
    if (!initialized) {
      return;
    }

    const isTokenValid = token && token.length > 0 && VerifyJwt(token);

    // If the token is not valid, refetch it
    if (!isTokenValid) {
      tokenQuery.refetch();
    }
  }, [token, initialized]);

  React.useEffect(() => {
    if (tokenQuery.data?.ok) {
      setToken(tokenQuery.data.token);
    }
  }, [tokenQuery.data]);

  return (
    <CitybusTokenContext.Provider
      value={{
        token,
        refetchToken: () => tokenQuery.refetch(),
      }}
    >
      {children}
    </CitybusTokenContext.Provider>
  );
};

export const useCitybusToken = () => {
  return React.useContext(CitybusTokenContext);
};
