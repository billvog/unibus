import { type DbBusStop } from "@api/types/models";
import React from "react";

import BusLineCode from "@web/components/ui/bus-line-code";
import { PrettifyName } from "@web/lib/prettify-name";

type BusStopProps = {
  busStop: DbBusStop;
  onClick: () => void;
};

const BusStop = ({ busStop, onClick }: BusStopProps) => {
  const prettyBusStopName = React.useMemo(
    () => PrettifyName(busStop.name),
    [busStop.name],
  );

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col rounded-2xl bg-white p-4"
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold text-gray-500">{busStop.code}</div>
        <div className="flex items-center gap-1">
          {busStop.busLines.map(({ busLine }) => (
            <BusLineCode key={busLine.id} busLine={busLine} />
          ))}
        </div>
      </div>
      <div className="text-lg font-extrabold">{prettyBusStopName}</div>
    </div>
  );
};

export default BusStop;
