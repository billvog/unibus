import React from "react";

import BusLineCode from "@web/components/ui/bus-line-code";
import { type BusStop as BusStopType } from "@web/types/citybus";
import { PrettifyName } from "@web/utils/prettify-name";
import { trpc } from "@web/utils/trpc";

type BusStopProps = {
  busStop: BusStopType;
  onClick: () => void;
};

const BusStop = ({ busStop, onClick }: BusStopProps) => {
  const { getBusLines } = trpc.useUtils();

  const busLinesData = React.useMemo(
    () => getBusLines.getData(),
    [getBusLines],
  );

  const prettyBusStopName = React.useMemo(
    () => PrettifyName(busStop.name),
    [busStop.name],
  );

  const busLineColor = React.useMemo(() => {
    if (!busLinesData) {
      return undefined;
    }

    const busLine = busLinesData.find(
      (line) => line.code === busStop.lineCodes[0],
    );

    return {
      bgColor: busLine?.color,
      textColor: busLine?.textColor,
    };
  }, [busLinesData, busStop.lineCodes]);

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col rounded-2xl bg-white p-4"
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold text-gray-500">{busStop.code}</div>
        <BusLineCode
          lineCode={busStop.lineCodes[0]!}
          bgColor={busLineColor?.bgColor}
          textColor={busLineColor?.textColor}
        />
      </div>
      <div className="text-lg font-extrabold">{prettyBusStopName}</div>
    </div>
  );
};

export default BusStop;
