import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import BusStopSchedule from "@web/components/ui/bus-stop-schedule";
import BusVehicle from "@web/components/ui/bus-vehicle";
import { Button } from "@web/components/ui/button";
import DynamicTitle from "@web/components/ui/dynamic-title";
import { Spinner } from "@web/components/ui/spinner";
import { cn } from "@web/lib/utils";
import { type Coordinates } from "@web/types/coordinates";
import { type MapFlyToDetail } from "@web/types/events";
import { Events } from "@web/utils/constants";
import { PrettifyName } from "@web/utils/prettify-name";
import { trpc } from "@web/utils/trpc";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

type ViewMode = "live" | "schedule";

type BusStopContentProps = {
  canScroll: boolean;
  onBusVehicleClick: () => void;
};

const BusStopContent = ({
  canScroll,
  onBusVehicleClick: handleBusVehicleClick,
}: BusStopContentProps) => {
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
            BusVehicle: {
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
      <div className="flex items-center gap-4 border-b-2 border-gray-100 px-10 pb-4 pt-8">
        <DynamicTitle title={prettyStopName} onClick={onBusStopNameClick} />
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={onViewModeToggle}
        >
          <span>{viewMode === "live" ? "🗓️" : "🚍"}</span>
          <span>{viewMode === "live" ? "Πρόγραμμα" : "Τώρα"}</span>
        </Button>
      </div>
      <div
        className={cn(
          "flex h-full flex-col gap-4 px-10 pb-8 pt-5",
          canScroll && "no-scrollbar overflow-y-auto",
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
