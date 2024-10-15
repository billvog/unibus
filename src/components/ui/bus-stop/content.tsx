import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusVehicle from "@/components/ui/bus-vehicle";
import { Spinner } from "@/components/ui/spinner";
import { Coordinates } from "@/types/coordinates";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { Drawer } from "vaul";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

const BusStopContent = () => {
  const { selectedStop, setSelectedStop, setLiveBusCoordinates } = useBusStop();
  const { token } = useCitybusToken();

  const busLiveQuery = useQuery({
    queryKey: ["bus-live", selectedStop?.code],
    queryFn: () => GetBusLiveStop(token ?? "", selectedStop?.code!),
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
  }, [vehicles]);

  const onBusStopNameClick = React.useCallback(() => {
    if (!selectedStop) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("map:fly-to", {
        detail: {
          latitude: selectedStop.latitude,
          longitude: selectedStop.longitude,
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

      window.dispatchEvent(
        new CustomEvent("map:fly-to", {
          detail: coordinates,
        }),
      );
    },
    [vehicles],
  );

  if (busLiveQuery.isLoading) {
    return (
      <div className="self-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!busLiveQuery.data?.ok || !selectedStop) {
    return null;
  }

  return (
    <>
      <Drawer.Title className="text-2xl font-bold" onClick={onBusStopNameClick}>
        {selectedStop.name}
      </Drawer.Title>
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
