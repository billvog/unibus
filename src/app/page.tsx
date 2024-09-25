"use client";

import { GetBusStops } from "@/actions/get-bus-stops";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusStop from "@/components/ui/bus-stop";
import Map from "@/components/ui/map";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export default function Page() {
  const token = useCitybusToken();
  const { selectedId, setSelectedId } = useBusStop();

  const busStopsQuery = useQuery({
    queryKey: ["busStops"],
    queryFn: () => GetBusStops(token ?? ""),
    enabled: !!token,
  });

  const busStops = React.useMemo(
    () => (busStopsQuery.data?.ok ? busStopsQuery.data.stops : []),
    [busStopsQuery.data],
  );

  const selectedBusStop = React.useMemo(
    () => busStops.find((stop) => stop.id === selectedId),
    [busStops, selectedId],
  );

  const onBusStopClick = React.useCallback(
    (id: number) => {
      setSelectedId(id);
    },
    [setSelectedId],
  );

  const onBusStopClear = React.useCallback(() => {
    setSelectedId(null);
  }, [setSelectedId]);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Map busStops={busStops} onBusStopClick={onBusStopClick} />
      {selectedBusStop && (
        <BusStop busStop={selectedBusStop} onClose={onBusStopClear} />
      )}
    </div>
  );
}
