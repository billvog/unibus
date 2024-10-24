import { type BusStopTime as BusSopTimeType } from "@api/types/models";
import React from "react";

import BusLineCode from "@web/components/ui/bus-line-code";
import { PrettifyName } from "@web/utils/prettify-name";

type BusStopTripProps = {
  trip: BusSopTimeType;
};

const BusStopTrip = ({ trip }: BusStopTripProps) => {
  const prettyRouteName = React.useMemo(
    () => PrettifyName(trip.busRoute.name),
    [trip.busRoute],
  );

  return (
    <div className="flex flex-col justify-center gap-1 rounded-xl bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        <BusLineCode busLine={trip.busLine} />
        <span className="text-xl font-bold">{trip.time}</span>
      </div>
      <span className="text-xs">{prettyRouteName} </span>
    </div>
  );
};

export default BusStopTrip;
