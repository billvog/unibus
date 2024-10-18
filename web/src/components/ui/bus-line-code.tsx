import React from "react";

type BusLineCodeProps = {
  lineCode: string;
  bgColor: string | undefined;
  textColor: string | undefined;
};

const BusLineCode = ({ bgColor, lineCode, textColor }: BusLineCodeProps) => {
  return (
    <span
      className="flex items-center justify-center rounded-lg px-1.5 py-0.5 text-xs font-bold"
      style={{
        color: textColor ?? "white",
        backgroundColor: bgColor ?? "gray",
      }}
    >
      {lineCode}
    </span>
  );
};

export default BusLineCode;
