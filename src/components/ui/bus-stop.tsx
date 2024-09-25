import { type BusStop as BusStopType } from "@/types/citybus";
import { X } from "lucide-react";
import React from "react";

type BusStopProps = {
  busStop: BusStopType;
  onClose: () => void;
};

const BusStop = ({ busStop, onClose }: BusStopProps) => {
  return (
    <div className="relative p-10">
      <div className="absolute right-0 top-0 p-4">
        <X className="cursor-pointer" onClick={onClose} />
      </div>
      <h1 className="text-2xl font-bold">{busStop.name}</h1>
      <p className="text-lg text-gray-600">{busStop.code}</p>
    </div>
  );
};

export default BusStop;
