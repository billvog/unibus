import { useFeatureFlagEnabled } from "posthog-js/react";
import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import BusStopSchedule from "@web/components/ui/bus-stop-schedule";
import BusVehicle from "@web/components/ui/bus-vehicle";
import ActionButton from "@web/components/ui/drawer/content/action-button";
import DirectionsButton from "@web/components/ui/drawer/content/action-button/directions";
import FavoriteButton from "@web/components/ui/drawer/content/action-button/favorite";
import Content from "@web/components/ui/drawer/content/elements";
import DynamicTitle from "@web/components/ui/dynamic-title";
import { Spinner } from "@web/components/ui/spinner";
import { useUser } from "@web/components/user-context";
import { trpc } from "@web/lib/trpc";
import { Events, FeatureFlags } from "@web/lib/utils/constants";
import { PrettifyName } from "@web/lib/utils/prettify-name";
import { cn } from "@web/lib/utils/tailwind";
import { type Coordinates } from "@web/types/coordinates";
import { type DrawerContentProps } from "@web/types/drawer";
import { type MapFlyToDetail } from "@web/types/events";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

type ViewMode = "live" | "schedule";

const BusStopContent = ({
  isFullyOpen,
  minimizeDrawer,
}: DrawerContentProps) => {
  const directionsEnabled = useFeatureFlagEnabled(FeatureFlags.Directions);

  const { user } = useUser();

  const { selectedStop, setLiveBusCoordinates } = useBusStop();

  const [viewMode, setViewMode] = React.useState<ViewMode>("live");
  const [selectedDay, setSelectedDay] = React.useState<number>(() => {
    const now = new Date();
    return now.getDay();
  });

  const prettyStopName = React.useMemo(
    () => (selectedStop ? PrettifyName(selectedStop.name) : ""),
    [selectedStop],
  );

  const busLiveQuery = trpc.getBusLiveStop.useQuery(
    { stopId: selectedStop?.id ?? 0 },
    {
      // We change the stale time to a lower value to make sure we get fresh data
      staleTime: 5 * 1000, // 5 seconds
      refetchInterval: BusLiveQueryRefetchInterval,
      enabled: !!selectedStop && viewMode === "live",
    },
  );

  const vehicles = React.useMemo(
    () => (busLiveQuery.data?.ok ? (busLiveQuery.data.vehicles ?? []) : []),
    [busLiveQuery.data],
  );

  const hasLiveVehicles = React.useMemo(
    () => busLiveQuery.data?.ok && busLiveQuery.data.vehicles.length > 0,
    [busLiveQuery.data],
  );

  const busStopScheduleQuery = trpc.getBusStopSchedule.useQuery(
    {
      stopId: selectedStop?.id ?? 0,
      day: selectedDay,
    },
    {
      enabled: !!selectedStop && viewMode === "schedule",
    },
  );

  const busStopTrips = React.useMemo(
    () => busStopScheduleQuery.data ?? [],
    [busStopScheduleQuery.data],
  );

  React.useEffect(() => {
    if (vehicles.length === 0) {
      return;
    }

    const firstVehicle = vehicles[0]!;
    setLiveBusCoordinates({
      latitude: Number(firstVehicle.latitude),
      longitude: Number(firstVehicle.longitude),
    });
  }, [vehicles, setLiveBusCoordinates]);

  const onBusStopNameClick = React.useCallback(() => {
    if (!selectedStop) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent<MapFlyToDetail>("map:fly-to", {
        detail: {
          coordinates: {
            longitude: selectedStop.location.x,
            latitude: selectedStop.location.y,
          },
        },
      }),
    );
  }, [selectedStop]);

  const onBusVehicleClick = React.useCallback(
    (vehicleCode: string) => {
      const vehicle = vehicles.find((v) => v.vehicleCode === vehicleCode);
      if (!vehicle) {
        return;
      }

      const coordinates: Coordinates = {
        latitude: Number(vehicle.latitude),
        longitude: Number(vehicle.longitude),
      };

      if (coordinates.latitude === 0 && coordinates.longitude === 0) {
        return;
      }

      setLiveBusCoordinates(coordinates);

      minimizeDrawer();

      // Capture event
      window.dispatchEvent(
        new CustomEvent(Events.Analytics.BusVehicleClick, {
          detail: {
            busVehicle: {
              vehicleCode,
              stopCode: selectedStop?.code,
            },
          },
        }),
      );

      window.dispatchEvent(
        new CustomEvent<MapFlyToDetail>("map:fly-to", {
          detail: {
            coordinates,
          },
        }),
      );
    },
    [vehicles, selectedStop, minimizeDrawer, setLiveBusCoordinates],
  );

  const onViewModeToggle = React.useCallback(() => {
    setViewMode((prev) => (prev === "live" ? "schedule" : "live"));
  }, []);

  if (!selectedStop) {
    return null;
  }

  return (
    <>
      <Content.Header isFullyOpen={isFullyOpen}>
        <DynamicTitle
          title={prettyStopName}
          className="cursor-pointer"
          onClick={onBusStopNameClick}
        />
        <div
          className={cn(
            "flex items-center gap-2",
            isFullyOpen && "no-scrollbar w-full overflow-x-auto",
          )}
        >
          {/* View mode toggle */}
          <ActionButton
            icon={<span>{viewMode === "live" ? "🗓️" : "🚍"}</span>}
            label={viewMode === "live" ? "Πρόγραμμα" : "Τώρα"}
            isCompact={!isFullyOpen}
            onClick={onViewModeToggle}
          />
          {/* Feature Flag: Directions */}
          {directionsEnabled && (
            <DirectionsButton
              isFullyOpen={isFullyOpen}
              onDirectionsReceived={minimizeDrawer}
            />
          )}
          {/* Favorite */}
          {user && (
            <FavoriteButton isFullyOpen={isFullyOpen} busStop={selectedStop} />
          )}
        </div>
      </Content.Header>
      <Content.Body isFullyOpen={isFullyOpen}>
        {/* Bus Live */}
        {viewMode === "live" &&
          (busLiveQuery.isLoading ? (
            <div className="flex flex-1 justify-center py-5">
              <Spinner className="text-gray-500" />
            </div>
          ) : hasLiveVehicles ? (
            <div className="flex flex-col gap-4">
              {vehicles.map((vehicle) => (
                <BusVehicle
                  key={vehicle.vehicleCode}
                  vehicle={vehicle}
                  onClick={() => onBusVehicleClick(vehicle.vehicleCode)}
                />
              ))}
            </div>
          ) : (
            <div>Δεν αναμένονται λεωφορεία τα επόμενα 30 λεπτά 😢</div>
          ))}

        {/* Bus Schedule */}
        {viewMode === "schedule" && (
          <BusStopSchedule
            busStopTrips={busStopTrips}
            selectedDay={selectedDay}
            onDayClick={(day) => setSelectedDay(day)}
            isLoading={busStopScheduleQuery.isLoading}
          />
        )}
      </Content.Body>
    </>
  );
};

export default BusStopContent;
