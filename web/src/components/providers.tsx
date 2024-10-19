"use client";

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React from "react";

import { BusStopProvider } from "@web/components/bus-stop-context";
import { CitybusTokenProvider } from "@web/components/citybus-token-context";
import { Toaster } from "@web/components/ui/sonner";
import { env } from "@web/env";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
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
      <PostHogProvider client={posthog}>
        <CitybusTokenProvider>
          <BusStopProvider>
            {children}
            <Toaster richColors />
          </BusStopProvider>
        </CitybusTokenProvider>
      </PostHogProvider>
    </QueryClientProvider>
  );
}
