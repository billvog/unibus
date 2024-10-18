"use client";

import { GetBusLines } from "@/actions/get-bus-lines";
import { GetBusStops } from "@/actions/get-bus-stops";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusStopDrawer from "@/components/ui/bus-stop-drawer";
import BusStopSearch from "@/components/ui/bus-stop-search";
import Map from "@/components/ui/map";
import { FullscreenSpinner } from "@/components/ui/spinner";
import { useCaptureAnalytics } from "@/hooks/useCaptureAnalytics";
import { useGeolocation } from "@/hooks/useGeolocation";
import { type MapFlyToDetail } from "@/types/events";
import { Events } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

export default function Page() {
  useCaptureAnalytics();

  const { token, refetchToken } = useCitybusToken();
  const { setSelectedStop } = useBusStop();

  const geolocation = useGeolocation();

  const busLinesQuery = useQuery({
    queryKey: ["busLines"],
    queryFn: () => GetBusLines(token ?? ""),
    enabled: !!token,
  });

  const busStopsQuery = useQuery({
    queryKey: ["busStops"],
    queryFn: () => GetBusStops(token ?? ""),
    enabled: !!token,
  });

  const isLoading = busLinesQuery.isLoading || busStopsQuery.isLoading;

  const busStops = React.useMemo(
    () => (busStopsQuery.data?.ok ? busStopsQuery.data.stops : []),
    [busStopsQuery.data],
  );

  const onBusStopClick = React.useCallback(
    (id: number, overwriteZoom?: boolean) => {
      const busStop = busStops.find((stop) => stop.id === id) ?? null;
      setSelectedStop(busStop);

      // If bus stop is not found, don't continue
      if (!busStop) {
        return;
      }

      // Capture event
      window.dispatchEvent(
        new CustomEvent(Events.Analytics.BusStopClick, {
          detail: {
            from: "Map",
            busStop: {
              id: busStop.id,
              name: busStop.name,
            },
          },
        }),
      );

      // Emit event to fly map to bus stop
      window.dispatchEvent(
        new CustomEvent<MapFlyToDetail>("map:fly-to", {
          detail: {
            coordinates: {
              latitude: busStop.latitude,
              longitude: busStop.longitude,
            },
            overwriteZoom,
          },
        }),
      );
    },
    [busStops, setSelectedStop],
  );

  React.useEffect(() => {
    // Refetch bus stops when token changes
    if (token && !busStopsQuery.data?.ok) {
      void busStopsQuery.refetch();
    }
  }, [token, busStopsQuery]);

  React.useEffect(() => {
    // In case server responds with 401, refetch the token
    if (
      busStopsQuery.data &&
      !busStopsQuery.data.ok &&
      busStopsQuery.data.status === 401
    ) {
      refetchToken();
    }
  }, [busStopsQuery.data, refetchToken]);

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
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      {isLoading && <FullscreenSpinner display="absolute" />}
      {busStops.length > 0 && (
        <BusStopSearch busStops={busStops} onBusStopClick={onBusStopClick} />
      )}
      <Map
        busStops={busStops}
        onBusStopClick={(id) => onBusStopClick(id, false)}
        userLocation={geolocation.position}
      />
      <BusStopDrawer />
    </div>
  );
}
