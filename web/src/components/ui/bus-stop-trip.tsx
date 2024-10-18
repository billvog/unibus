import BusLineCode from "@/components/ui/bus-line-code";
import { type BusStopTrip as BusStopTripType } from "@/types/citybus";
import { PrettifyName } from "@/utils/prettify-name";
import React from "react";

type BusStopTripProps = {
  trip: BusStopTripType;
};

const BusStopTrip = ({ trip }: BusStopTripProps) => {
  const prettyRouteName = React.useMemo(
    () => PrettifyName(trip.routeName),
    [trip.routeName],
  );

  return (
    <div className="flex flex-col justify-center gap-1 rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        <BusLineCode
          lineCode={trip.lineCode}
          bgColor={trip.lineColor}
          textColor={trip.lineTextColor}
        />
        <span className="text-xl font-bold">{trip.tripTime}</span>
      </div>
      <span className="text-xs">{prettyRouteName} </span>
    </div>
  );
};

export default BusStopTrip;
