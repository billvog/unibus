"use client";

import { GetBusLinePoints } from "@/actions/get-bus-line-points";
import { GetBusStops } from "@/actions/get-bus-stops";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusStop from "@/components/ui/bus-stop";
import Map from "@/components/ui/map";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Page() {
  const token = useCitybusToken();
  const { selectedStop, setSelectedStop } = useBusStop();

  const busStopsQuery = useQuery({
    queryKey: ["busStops"],
    queryFn: () => GetBusStops(token ?? ""),
    enabled: !!token,
  });

  const busStops = React.useMemo(
    () => (busStopsQuery.data?.ok ? busStopsQuery.data.stops : []),
    [busStopsQuery.data],
  );

  const onBusStopClick = React.useCallback(
    (id: number) => {
      setSelectedStop(busStops.find((stop) => stop.id === id) ?? null);
    },
    [busStops],
  );

  const onBusStopClear = React.useCallback(() => {
    setSelectedStop(null);
  }, []);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Map busStops={busStops} onBusStopClick={onBusStopClick} />
      {selectedStop && (
        <BusStop busStop={selectedStop} onClose={onBusStopClear} />
      )}
    </div>
  );
}
