import type { AppRouter } from "@repo/api";
import { QueryClient } from "@tanstack/react-query";
import { httpLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { env } from "@web/env";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      queryClient,
      links: [
        httpLink({
          url: `${env.NEXT_PUBLIC_API_URL}/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});
