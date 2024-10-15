"use client";

import { GetBusStops } from "@/actions/get-bus-stops";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusStopDrawer from "@/components/ui/bus-stop-drawer";
import BusStopSearch from "@/components/ui/bus-stop-search";
import Map from "@/components/ui/map";
import { FullscreenSpinner } from "@/components/ui/spinner";
import { useGeolocation } from "@/hooks/useGeolocation";
import { Coordinates } from "@/types/coordinates";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function Page() {
  const { token, refetchToken } = useCitybusToken();
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
      const busStop = busStops.find((stop) => stop.id === id) ?? null;
      setSelectedStop(busStop);

      // If bus stop is not found, don't continue
      if (!busStop) {
        return;
      }

      // Emit event to fly map to bus stop
      window.dispatchEvent(
        new CustomEvent<Coordinates>("map:fly-to", {
          detail: {
            latitude: busStop.latitude,
            longitude: busStop.longitude,
          },
        }),
      );
    },
    [busStops],
  );

  React.useEffect(() => {
    // Refetch bus stops when token changes
    if (token && !busStopsQuery.data?.ok) {
      busStopsQuery.refetch();
    }
  }, [token, busStopsQuery.data]);

  React.useEffect(() => {
    // In case server responds with 401, refetch the token
    if (
      busStopsQuery.data &&
      !busStopsQuery.data.ok &&
      busStopsQuery.data.status === 401
    ) {
      refetchToken();
    }
  }, [busStopsQuery.data]);

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
    <div className="relative flex h-full w-full flex-1 flex-col">
      {busStopsQuery.isLoading && <FullscreenSpinner display="absolute" />}
      {busStops.length > 0 && (
        <BusStopSearch busStops={busStops} onBusStopClick={onBusStopClick} />
      )}
      <Map
        busStops={busStops}
        onBusStopClick={onBusStopClick}
        userLocation={geolocation.position}
      />
      <BusStopDrawer />
    </div>
  );
}
