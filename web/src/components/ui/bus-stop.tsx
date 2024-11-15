import { type DbBusStop } from "@api/types/models";
import { BusFront, Star } from "lucide-react";
import React from "react";

import BusLineCode from "@web/components/ui/bus-line-code";
import { trpc } from "@web/lib/trpc";
import { PrettifyName } from "@web/lib/utils/prettify-name";

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
      className="flex cursor-pointer gap-[.5rem] rounded-2xl bg-white px-4 pb-5 pt-6"
      onClick={onClick}
    >
      <BusFront size={18} className="text-blue-500" />
      <div className="flex flex-col gap-1">
        <div className="text-lg font-extrabold leading-none">
          {prettyBusStopName}
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <div className="font-bold text-gray-500">{busStop.code}</div>
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
      </div>
    </div>
  );
};

export default BusStop;
