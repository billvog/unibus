import { useQueryClient } from "@tanstack/react-query";
import React from "react";

import { type GetBusLinesResponse } from "@web/actions/get-bus-lines";
import BusLineCode from "@web/components/ui/bus-line-code";
import { type BusStop as BusStopType } from "@web/types/citybus";
import { PrettifyName } from "@web/utils/prettify-name";

type BusStopProps = {
  busStop: BusStopType;
  onClick: () => void;
};

const BusStop = ({ busStop, onClick }: BusStopProps) => {
  const queryClient = useQueryClient();

  const busLinesData = queryClient.getQueryData<GetBusLinesResponse>([
    "busLines",
  ]);

  const prettyBusStopName = React.useMemo(
    () => PrettifyName(busStop.name),
    [busStop.name],
  );

  const busLineColor = React.useMemo(() => {
    if (!busLinesData?.ok) {
      return undefined;
    }

    const busLine = busLinesData.lines.find(
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
