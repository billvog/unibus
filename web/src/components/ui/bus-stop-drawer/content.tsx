import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { GetBusStopSchedule } from "@/actions/get-bus-stop-schedule";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusStopSchedule from "@/components/ui/bus-stop-schedule";
import BusVehicle from "@/components/ui/bus-vehicle";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { type Coordinates } from "@/types/coordinates";
import { MapFlyToDetail } from "@/types/events";
import { Events } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

type BusStopContentProps = {
  canScroll: boolean;
  onBusVehicleClick: () => void;
};

const BusStopContent = ({
  canScroll,
  onBusVehicleClick: handleBusVehicleClick,
}: BusStopContentProps) => {
  const { selectedStop, setSelectedStop, setLiveBusCoordinates } = useBusStop();
  const { token } = useCitybusToken();

  const busLiveQuery = useQuery({
    queryKey: ["bus-live", selectedStop?.code],
    queryFn: () => GetBusLiveStop(token ?? "", selectedStop?.code ?? ""),
    enabled: !!token && !!selectedStop,
    refetchInterval: BusLiveQueryRefetchInterval,
  });

  const vehicles = React.useMemo(
    () => (busLiveQuery.data?.ok ? (busLiveQuery.data.vehicles ?? []) : []),
    [busLiveQuery.data],
  );

  const hasLiveVehicles = React.useMemo(
    () => busLiveQuery.data?.ok && busLiveQuery.data.vehicles.length > 0,
    [busLiveQuery.data],
  );

  const busStopScheduleQuery = useQuery({
    queryKey: ["bus-stop-schedule", selectedStop?.code, 5],
    queryFn: () => GetBusStopSchedule(token ?? "", selectedStop?.code ?? "", 5),
    enabled: !!token && !!selectedStop,
  });

  const busStopTrips = React.useMemo(
    () =>
      busStopScheduleQuery.data?.ok ? busStopScheduleQuery.data.trips : [],
    [busStopScheduleQuery.data],
  );

  React.useEffect(() => {
    if (busLiveQuery.isError || (busLiveQuery.data && !busLiveQuery.data.ok)) {
      toast.error("Failed to fetch bus live data");
      setSelectedStop(null);
    }
  }, [busLiveQuery, setSelectedStop]);

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
            latitude: selectedStop.latitude,
            longitude: selectedStop.longitude,
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

  if (busLiveQuery.isLoading) {
    return (
      <div className="self-center py-16">
        <Spinner />
      </div>
    );
  }

  if (
    (!busLiveQuery.data?.ok && !busStopScheduleQuery.data?.ok) ||
    !selectedStop
  ) {
    return null;
  }

  return (
    <>
      <h1
        className="border-b-2 border-gray-100 px-10 pb-4 pt-8 text-xl font-bold"
        onClick={onBusStopNameClick}
      >
        {selectedStop.name}
      </h1>
      <div
        className={cn(
          "flex h-full flex-col gap-4 px-10 pb-8 pt-5",
          canScroll && "no-scrollbar overflow-y-auto",
        )}
      >
        {/* Bus Live */}
        {hasLiveVehicles && (
          <div className="flex flex-col gap-4">
            {vehicles.map((vehicle) => (
              <BusVehicle
                key={vehicle.vehicleCode}
                vehicle={vehicle}
                onClick={() => onBusVehicleClick(vehicle.vehicleCode)}
              />
            ))}
          </div>
        )}

        {/* Bus Schedule */}
        {busStopTrips.length > 0 && (
          <BusStopSchedule busStopTrips={busStopTrips} />
        )}
      </div>
    </>
  );
};

export default BusStopContent;
