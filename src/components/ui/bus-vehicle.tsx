import { BusVehicle as BusVehicleType } from "@/types/citybus";
import { formatTime } from "@/utils/format-time";
import { Clock9 } from "lucide-react";

type BusVehicleProps = {
  vehicle: BusVehicleType;
};

const BusVehicle = ({ vehicle }: BusVehicleProps) => {
  return (
    <div className="flex flex-col gap-1 bg-green-100 p-4">
      <div className="text-sm font-extrabold">{vehicle.lineName}</div>
      <div className="flex items-center gap-2 text-sm">
        <Clock9 size={16} />
        <div>{formatTime(vehicle.departureMins, vehicle.departureSeconds)}</div>
      </div>
    </div>
  );
};

export default BusVehicle;
