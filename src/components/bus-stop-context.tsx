"use client";

import { BusStop } from "@/types/citybus";
import React, { useState } from "react";

type BusStopContextType = {
  selectedStop: BusStop | null;
  setSelectedStop: React.Dispatch<React.SetStateAction<BusStop | null>>;
};

const BusStopContext = React.createContext<BusStopContextType>({
  selectedStop: null,
  setSelectedStop: () => {},
});

export const BusStopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  return (
    <BusStopContext.Provider
      value={{
        selectedStop,
        setSelectedStop,
      }}
    >
      {children}
    </BusStopContext.Provider>
  );
};

export const useBusStop = () => {
  return React.useContext(BusStopContext);
};
