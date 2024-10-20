"use client";

import React from "react";
import { toast } from "sonner";

import { useBusStop } from "@web/components/bus-stop-context";
import BusStopDrawer from "@web/components/ui/bus-stop-drawer";
import BusStopSearch from "@web/components/ui/bus-stop-search";
import GraveError from "@web/components/ui/grave-error";
import Map from "@web/components/ui/map";
import { FullscreenSpinner } from "@web/components/ui/spinner";
import { useCaptureAnalytics } from "@web/hooks/useCaptureAnalytics";
import { useGeolocation } from "@web/hooks/useGeolocation";
import { type MapFlyToDetail } from "@web/types/events";
import { Events } from "@web/utils/constants";
import { trpc } from "@web/utils/trpc";

function Page() {
  useCaptureAnalytics();

  const { setSelectedStop } = useBusStop();

  const geolocation = useGeolocation();

  const busLinesQuery = trpc.getBusLines.useQuery();
  const busStopsQuery = trpc.getBusStops.useQuery();

  const isLoading = busLinesQuery.isLoading || busStopsQuery.isLoading;

  const busStops = React.useMemo(
    () => busStopsQuery.data ?? [],
    [busStopsQuery.data],
  );

  const hasGraveError = React.useMemo(
    () => busStopsQuery.isError,
    [busStopsQuery.isError],
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
    // Show an error message if location could not be
    // retrieved, but skip the error if the user denied
    if (
      geolocation.error &&
      geolocation.error.code !== GeolocationPositionError.PERMISSION_DENIED
    ) {
      toast.error(geolocation.error.message);
    }
  }, [geolocation.error]);

  // Show message if we're getting a 500 from Citybus
  if (hasGraveError) {
    return <GraveError />;
  }

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

export default trpc.withTRPC(Page);
