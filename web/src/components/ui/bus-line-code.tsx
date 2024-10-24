import { type BusLine as BusLineType } from "@api/types/models";
import React from "react";

type BusLineCodeProps = {
  busLine: BusLineType;
};

const BusLineCode = ({ busLine }: BusLineCodeProps) => {
  return (
    <span
      className="flex items-center justify-center rounded-lg px-1.5 py-0.5 text-xs font-bold"
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
