import { type BusVehicle as BusVehicleType } from "@api/types/citybus";
import { Clock9 } from "lucide-react";
import React from "react";

import { formatTime } from "@web/lib/format-time";
import { cn } from "@web/lib/utils";

type BusVehicleProps = {
  vehicle: BusVehicleType;
  onClick?: () => void;
};

const BusVehicle = ({ vehicle, onClick }: BusVehicleProps) => {
  const hasLiveLocation = React.useMemo(
    () => vehicle.latitude !== "0" && vehicle.longitude !== "0",
    [vehicle.latitude, vehicle.longitude],
  );

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-xl p-4",
        hasLiveLocation ? "cursor-pointer bg-gray-100" : "border-2",
      )}
      onClick={onClick}
    >
      <div className="space-x-2 text-sm font-extrabold">
        <span>{vehicle.lineName}</span>
        <span style={{ color: vehicle.lineColor }}>({vehicle.lineCode})</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock9 size={16} />
        <div>{formatTime(vehicle.departureMins, vehicle.departureSeconds)}</div>
      </div>
    </div>
  );
};

export default BusVehicle;
