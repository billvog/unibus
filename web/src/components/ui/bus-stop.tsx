import { type DbBusStop } from "@api/types/models";
import { Star } from "lucide-react";
import React from "react";

import BusLineCode from "@web/components/ui/bus-line-code";
import { PrettifyName } from "@web/lib/utils/prettify-name";
import { trpc } from "@web/lib/trpc";

type BusStopProps = {
  busStop: DbBusStop;
  onClick: () => void;
};

const BusStop = ({ busStop, onClick }: BusStopProps) => {
  const {
    busStop: { favorites },
  } = trpc.useUtils();

  const prettyBusStopName = React.useMemo(
    () => PrettifyName(busStop.name),
    [busStop.name],
  );

  const isFavorite = React.useMemo(
    () => favorites.getData()?.includes(busStop.id),
    [busStop.id, favorites],
  );

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col gap-1 rounded-2xl bg-white p-4"
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold text-gray-500">{busStop.code}</div>
        <div className="flex items-center gap-1">
          {busStop.busLines.map(({ busLine }) => (
            <BusLineCode key={busLine.id} busLine={busLine} />
          ))}
        </div>
        {isFavorite && (
          <div title="Είναι στα αγαπημένα">
            <Star size={20} color="#facc15" fill="#facc15" />
          </div>
        )}
      </div>
      <div className="text-lg font-extrabold">{prettyBusStopName}</div>
    </div>
  );
};

export default BusStop;
