"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React from "react";
import superjson from "superjson";

import { BusStopProvider } from "@web/components/bus-stop-context";
import { Toaster } from "@web/components/ui/sonner";
import { UserProvider } from "@web/components/user-context";
import { UserLocationProvider } from "@web/components/user-location-context";
import { env } from "@web/env";
import { trpc } from "@web/lib/trpc";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = React.useState(() =>
    trpc.createClient({
      links: [
        httpLink({
          url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
          transformer: superjson,
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    }),
  );

  React.useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) {
      return;
    }

    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "/ingest",
      capture_pageview: false,
      capture_pageleave: true,
      persistence: "localStorage",
      person_profiles: "always",
      ui_host: "https://eu.posthog.com",
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <UserProvider>
          <UserLocationProvider>
            <PostHogProvider client={posthog}>
              <BusStopProvider>
                {children}
                <Toaster richColors />
              </BusStopProvider>
            </PostHogProvider>
          </UserLocationProvider>
        </UserProvider>
      </trpc.Provider>
    </QueryClientProvider>
  );
}
