"use client";

import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import MyDrawer from "@web/components/ui/drawer";
import GraveError from "@web/components/ui/grave-error";
import LocationPromptModal from "@web/components/ui/location-prompt-modal";
import Map from "@web/components/ui/map";
import Search from "@web/components/ui/search";
import { FullscreenSpinner } from "@web/components/ui/spinner";
import { useUser } from "@web/components/user-context";
import { useUserLocation } from "@web/components/user-location-context";
import { useBodyScroll } from "@web/hooks/useBodyScroll";
import { useCaptureAnalytics } from "@web/hooks/useCaptureAnalytics";
import { trpc } from "@web/lib/trpc";
import { Events } from "@web/lib/utils/constants";
import { type MapFlyToDetail } from "@web/types/events";

function Page() {
  useCaptureAnalytics();
  useBodyScroll(true); // disable scroll

  const { user } = useUser();
  const { isLocationEnabled } = useUserLocation();
  const { setSelectedStopId } = useBusStop();

  const showLocationPrompt = React.useMemo(
    () => !isLocationEnabled,
    [isLocationEnabled],
  );

  // Fetch user's favorite bus stops.
  // We're are going to access these through cache.
  trpc.busStop.favorites.useQuery(undefined, {
    enabled: !!user,
  });

  const busStopsQuery = trpc.getBusStops.useQuery();

  const isLoading = busStopsQuery.isLoading;

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
      setSelectedStopId(id);

      const busStop = busStops.find((stop) => stop.id === id) ?? null;
      if (!busStop) {
        return;
      }

      // Emit event for bus stop change
      window.dispatchEvent(new CustomEvent(Events.BusStopChanged));

      // Emit event to fly map to bus stop
      window.dispatchEvent(
        new CustomEvent<MapFlyToDetail>("map:fly-to", {
          detail: {
            coordinates: {
              longitude: busStop.location.x,
              latitude: busStop.location.y,
            },
            overwriteZoom,
          },
        }),
      );
    },
    [busStops, setSelectedStopId],
  );

  // Show message if we're getting a 500 from Citybus
  if (hasGraveError) {
    return <GraveError />;
  }

  return (
    <div className="relative flex h-full w-full flex-1 flex-col overflow-hidden">
      {isLoading && <FullscreenSpinner display="absolute" />}
      {showLocationPrompt && <LocationPromptModal />}
      <Search onBusStopClick={onBusStopClick} />
      <Map
        busStops={busStops}
        onBusStopClick={(id) => onBusStopClick(id, false)}
      />
      <MyDrawer />
    </div>
  );
}

export default Page;
