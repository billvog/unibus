"use client";

import { GetBusStops } from "@/actions/get-bus-stops";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusStop from "@/components/ui/bus-stop";
import Map from "@/components/ui/map";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function Page() {
  const token = useCitybusToken();
  const { setSelectedStop } = useBusStop();

  const geolocation = useGeolocation();

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

  React.useEffect(() => {
    // Show an error message if location could not be
    // retrieved, but skip the error if the user denied
    if (
      geolocation.error &&
      geolocation.error.code !== GeolocationPositionError.PERMISSION_DENIED
    ) {
      toast.error(geolocation.error.message);
    }
  }, [geolocation.error]);

  return (
    <div className="flex h-full w-full flex-1 flex-col">
      <Map
        busStops={busStops}
        onBusStopClick={onBusStopClick}
        userLocation={geolocation.position}
      />
      <BusStop />
    </div>
  );
}
