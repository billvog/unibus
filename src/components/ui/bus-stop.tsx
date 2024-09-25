import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { useBusStop } from "@/components/bus-stop-context";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusVehicle from "@/components/ui/bus-vehicle";
import { Spinner } from "@/components/ui/spinner";
import { BusStop as BusStopType } from "@/types/citybus";
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
  const { setSelectedId } = useBusStop();
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
      setSelectedId(null);
    }
  }, [busLiveQuery, setSelectedId]);

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
      <h1 className="text-2xl font-bold">{busStop.name}</h1>
      <div className="flex flex-col gap-2">
        {vehicles.length === 0 ? (
          <div>Δεν αναμένονται λεωφορεία τα επόμενα 30 λεπτά 😢</div>
        ) : (
          vehicles.map((vehicle) => (
            <BusVehicle key={vehicle.vehicleCode} vehicle={vehicle} />
          ))
        )}
      </div>
    </div>
  );
};

export default BusStop;
