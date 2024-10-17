import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusVehicle from "@/components/ui/bus-vehicle";
import { Spinner } from "@/components/ui/spinner";
import { type Coordinates } from "@/types/coordinates";
import { MapFlyToDetail } from "@/types/events";
import { Events } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

type BusStopContentProps = {
  onBusVehicleClick: () => void;
};

const BusStopContent = ({
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
      <div className="self-center py-14">
        <Spinner />
      </div>
    );
  }

  if (!busLiveQuery.data?.ok || !selectedStop) {
    return null;
  }

  return (
    <>
      <h1 className="text-xl font-bold" onClick={onBusStopNameClick}>
        {selectedStop.name}
      </h1>
      <div className="flex flex-col gap-3">
        {vehicles.length === 0 ? (
          <div>Δεν αναμένονται λεωφορεία τα επόμενα 30 λεπτά 😢</div>
        ) : (
          vehicles.map((vehicle) => (
            <BusVehicle
              key={vehicle.vehicleCode}
              vehicle={vehicle}
              onClick={() => onBusVehicleClick(vehicle.vehicleCode)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default BusStopContent;
