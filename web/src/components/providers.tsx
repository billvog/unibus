"use client";

import { BusStopProvider } from "@/components/bus-stop-context";
import { CitybusTokenProvider } from "@/components/citybus-token-context";
import { Toaster } from "@/components/ui/sonner";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

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

  return (
    <QueryClientProvider client={queryClient}>
      <CitybusTokenProvider>
        <BusStopProvider>
          {children}
          <Toaster richColors />
        </BusStopProvider>
      </CitybusTokenProvider>
    </QueryClientProvider>
  );
}
