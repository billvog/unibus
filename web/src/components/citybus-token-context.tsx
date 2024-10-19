"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";

import { GetCitybusToken } from "@web/actions/get-citybus-token";
import { usePersistedState } from "@web/hooks/usePersistedState";
import { Events, StorageKeys } from "@web/utils/constants";
import { VerifyJwt } from "@web/utils/verify-jwt";

type CitybusTokenContextType = {
  token: string | null;
  refetchToken: () => void;
};

const CitybusTokenContext = React.createContext<CitybusTokenContextType>({
  token: null,
  refetchToken: () => {
    throw new Error("refetchToken function must be overridden");
  },
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
      void tokenQuery.refetch();

      // Capture event
      window.dispatchEvent(
        new CustomEvent(Events.Analytics.CitybusTokenGenerated),
      );
    }
  }, [token, initialized, tokenQuery]);

  React.useEffect(() => {
    if (tokenQuery.data?.ok) {
      setToken(tokenQuery.data.token);
    }
  }, [tokenQuery.data, setToken]);

  return (
    <CitybusTokenContext.Provider
      value={{
        token,
        refetchToken: () => {
          void tokenQuery.refetch();
        },
      }}
    >
      {children}
    </CitybusTokenContext.Provider>
  );
};

export const useCitybusToken = () => {
  return React.useContext(CitybusTokenContext);
};
