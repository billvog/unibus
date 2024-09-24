"use client";

import { GetBusStops } from "@/actions/get-bus-stops";
import { useCitybusToken } from "@/components/citybus-token-context";
import Map from "@/components/ui/map";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Page() {
  const token = useCitybusToken();

  const busStopsQuery = useQuery({
    queryKey: ["busStops"],
    queryFn: () => GetBusStops(token ?? ""),
    enabled: !!token,
  });

  const busStops = React.useMemo(
    () => (busStopsQuery.data?.ok ? busStopsQuery.data.stops : []),
    [busStopsQuery.data],
  );

  return (
    <div className="flex h-full w-full flex-1">
      <Map busStops={busStops} />
    </div>
  );
}
