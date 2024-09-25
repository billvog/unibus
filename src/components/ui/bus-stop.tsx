import { GetBusLiveStop } from "@/actions/get-bus-live-stop";
import { useCitybusToken } from "@/components/citybus-token-context";
import { type BusStop as BusStopType } from "@/types/citybus";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React from "react";

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

  if (busLiveQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (!busLiveQuery.data?.ok) {
    return <div>Error</div>;
  }

  return (
    <div className="relative p-10">
      <div className="absolute right-0 top-0 p-4">
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <h1 className="text-2xl font-bold">{busStop.name}</h1>
      <div>
        {busLiveQuery.data?.vehicles.map((vehicle) => (
          <div key={vehicle.vehicleCode}>
            <div>{vehicle.lineName}</div>
            <div>{vehicle.routeName}</div>
            <div>
              {vehicle.departureMins}:{vehicle.departureSeconds}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusStop;
