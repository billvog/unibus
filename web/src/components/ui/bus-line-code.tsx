import { type DbBusLine } from "@api/types/models";
import React from "react";

type BusLineCodeProps = {
  busLine: DbBusLine;
};

const BusLineCode = ({ busLine }: BusLineCodeProps) => {
  return (
    <span
      className="flex items-center justify-center rounded-lg px-1.5 py-[1px] text-xs font-bold leading-tight"
      style={{
        color: busLine.textColor ?? "white",
        backgroundColor: busLine.bgColor ?? "gray",
      }}
    >
      {busLine.code}
    </span>
  );
};

export default BusLineCode;
