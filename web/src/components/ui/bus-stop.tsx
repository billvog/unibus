import { type GetBusLinesResponse } from "@/actions/get-bus-lines";
import { type BusStop as BusStopType } from "@/types/citybus";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

type BusStopProps = {
  busStop: BusStopType;
  onClick: () => void;
};

const BusStop = ({ busStop, onClick }: BusStopProps) => {
  const queryClient = useQueryClient();

  const busLinesData = queryClient.getQueryData<GetBusLinesResponse>([
    "busLines",
  ]);

  const busLineColor = React.useMemo(() => {
    if (!busLinesData?.ok) {
      return undefined;
    }

    const busLine = busLinesData.lines.find(
      (line) => line.code === busStop.lineCodes[0],
    );

    return busLine?.color;
  }, [busLinesData, busStop.lineCodes]);

  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer flex-col rounded-2xl bg-white p-4"
    >
      <div className="flex items-center gap-2">
        <div className="text-sm font-bold text-gray-500">{busStop.code}</div>
        <div className="flex items-center">
          <span
            className="flex items-center justify-center rounded-xl px-1.5 py-0 text-xs font-bold leading-normal text-white"
            style={{
              backgroundColor: busLineColor ?? "gray",
            }}
          >
            {busStop.lineCodes[0]}
          </span>
        </div>
      </div>
      <div className="text-lg font-extrabold">{busStop.name}</div>
    </div>
  );
};

export default BusStop;
