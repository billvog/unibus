import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusVehicle from "@/components/ui/bus-vehicle";
import { Spinner } from "@/components/ui/spinner";
import { BusStop as BusStopType } from "@/types/citybus";
import { Coordinates } from "@/types/coordinates";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const BusLiveQueryRefetchInterval = 30 * 1000; // 30 seconds

type BusStopProps = {
  busStop: BusStopType;
  onClose: () => void;
};

const BusStop = ({ busStop, onClose }: BusStopProps) => {
  const { setSelectedStop, setLiveBusCoordinates } = useBusStop();
  const token = useCitybusToken();

  const busLiveQuery = useQuery({
    queryKey: ["bus-live", busStop.code],
    queryFn: () => GetBusLiveStop(token ?? "", busStop.code),
    enabled: !!token,
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
    window.dispatchEvent(
      new CustomEvent("map:fly-to", {
        detail: {
          latitude: busStop.latitude,
          longitude: busStop.longitude,
        },
      }),
    );
  }, [busStop]);

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
      <div className="flex min-h-[210px] items-center justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (!busLiveQuery.data?.ok) {
    return null;
  }

  return (
    <div className="relative flex max-h-[300px] min-h-[210px] flex-col gap-4 overflow-y-auto p-10">
      <div className="absolute right-0 top-0 p-4">
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <h1 className="text-2xl font-bold" onClick={onBusStopNameClick}>
        {busStop.name}
      </h1>
      <div className="flex flex-col gap-2">
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
    </div>
  );
};

export default BusStop;
