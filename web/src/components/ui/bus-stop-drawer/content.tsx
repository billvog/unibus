import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import ActionButton from "@web/components/ui/bus-stop-drawer/action-button";
import FavoriteButton from "@web/components/ui/bus-stop-drawer/action-button/favorite";
import BusStopSchedule from "@web/components/ui/bus-stop-schedule";
import BusVehicle from "@web/components/ui/bus-vehicle";
import DynamicTitle from "@web/components/ui/dynamic-title";
import { Spinner } from "@web/components/ui/spinner";
import { useUser } from "@web/components/user-context";
import { useUserLocation } from "@web/components/user-location-context";
import { Events } from "@web/lib/constants";
import { PrettifyName } from "@web/lib/prettify-name";
import { trpc } from "@web/lib/trpc";
import { cn } from "@web/lib/utils";
import { calculateWalkingDistance } from "@web/lib/walking-distance";
import { type Coordinates } from "@web/types/coordinates";
import { type MapFlyToDetail } from "@web/types/events";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

type ViewMode = "live" | "schedule";

type BusStopContentProps = {
  isFullyOpen: boolean;
  onBusVehicleClick: () => void;
};

const BusStopContent = ({
  isFullyOpen,
  onBusVehicleClick: handleBusVehicleClick,
}: BusStopContentProps) => {
  const { user } = useUser();
  const { userLocation } = useUserLocation();
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

  const walkingTime = React.useMemo(() => {
    if (!selectedStop || !userLocation) {
      return null;
    }

    const distance = calculateWalkingDistance(userLocation, {
      latitude: selectedStop.location.y,
      longitude: selectedStop.location.x,
    });

    return distance.walkingTime;
  }, [selectedStop, userLocation]);

  const busLiveQuery = trpc.getBusLiveStop.useQuery(
    { stopCode: selectedStop?.code ?? "" },
    {
      enabled: !!selectedStop && viewMode === "live",
      refetchInterval: BusLiveQueryRefetchInterval,
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

      handleBusVehicleClick();

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
    [vehicles, selectedStop, handleBusVehicleClick, setLiveBusCoordinates],
  );

  const onViewModeToggle = React.useCallback(() => {
    setViewMode((prev) => (prev === "live" ? "schedule" : "live"));
  }, []);

  if (!selectedStop) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "flex border-b-2 border-gray-100 px-10 pb-4 pt-8",
          isFullyOpen ? "flex-col items-start gap-2" : "items-center gap-4",
        )}
      >
        <DynamicTitle title={prettyStopName} onClick={onBusStopNameClick} />
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
          {/* Walking time + Directions */}
          {walkingTime && (
            <ActionButton
              icon={<span>🚶‍♂️</span>}
              label={`${walkingTime} λεπτ${walkingTime > 1 ? "ά" : "ό"}`}
              isCompact={!isFullyOpen}
              // @TODO: Show walking directions.
              onClick={() => {}}
            />
          )}
          {/* Favorite */}
          {user && (
            <FavoriteButton isFullyOpen={isFullyOpen} busStop={selectedStop} />
          )}
        </div>
      </div>
      <div
        className={cn(
          "flex h-full flex-col gap-4 px-10 pb-8 pt-5",
          isFullyOpen && "no-scrollbar overflow-y-auto",
        )}
      >
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
      </div>
    </>
  );
};

export default BusStopContent;
