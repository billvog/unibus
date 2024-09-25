import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { useCitybusToken } from "@/components/citybus-token-context";
import BusVehicle from "@/components/ui/bus-vehicle";
import { Spinner } from "@/components/ui/spinner";
import { BusStop as BusStopType } from "@/types/citybus";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type BusStopProps = {
  busStop: BusStopType;
  onClose: () => void;
};

const BusStop = ({ busStop, onClose }: BusStopProps) => {
  const token = useCitybusToken();

  const busLiveQuery = useQuery({
    queryKey: ["bus-live", busStop.code],
    queryFn: () => GetBusLiveStop(token ?? "", busStop.code),
    enabled: !!token,
  });

  React.useEffect(() => {
    if (busLiveQuery.isError || (busLiveQuery.data && !busLiveQuery.data.ok)) {
      toast.error("Failed to fetch bus live data");
    }
  }, [busLiveQuery]);

  if (busLiveQuery.isLoading) {
    return (
      <div className="flex min-h-[210px] items-center justify-center p-10">
        <Spinner />
      </div>
    );
  }

  if (!busLiveQuery.data?.ok) {
    return <div>Error</div>;
  }

  return (
    <div className="relative flex max-h-[300px] min-h-[210px] flex-col gap-4 overflow-y-auto p-10">
      <div className="absolute right-0 top-0 p-4">
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <h1 className="text-2xl font-bold">{busStop.name}</h1>
      <div className="flex flex-col gap-2">
        {busLiveQuery.data?.vehicles.map((vehicle) => (
          <BusVehicle key={vehicle.vehicleCode} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};

export default BusStop;
