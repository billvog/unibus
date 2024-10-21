import { type BusStopTrip as BusStopTripType } from "@api/types/models";
import React from "react";

import BusLineCode from "@web/components/ui/bus-line-code";
import { PrettifyName } from "@web/utils/prettify-name";

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
        <span className="text-xl font-bold">{trip.time}</span>
      </div>
      <span className="text-xs">{prettyRouteName} </span>
    </div>
  );
};

export default BusStopTrip;
