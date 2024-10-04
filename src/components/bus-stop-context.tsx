"use client";

import { BusStop } from "@/types/citybus";
import { Coordinates } from "@/types/coordinates";
import React, { useState } from "react";

type BusStopContextType = {
  selectedStop: BusStop | null;
  setSelectedStop: React.Dispatch<React.SetStateAction<BusStop | null>>;
  liveBusCoordinates: Coordinates | null;
  setLiveBusCoordinates: React.Dispatch<
    React.SetStateAction<Coordinates | null>
  >;
};

const BusStopContext = React.createContext<BusStopContextType>({
  selectedStop: null,
  setSelectedStop: () => {},
  liveBusCoordinates: null,
  setLiveBusCoordinates: () => {},
});

export const BusStopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [liveBusCoordinates, setLiveBusCoordinates] =
    useState<Coordinates | null>(null);

  React.useEffect(() => {
    if (selectedStop === null) {
      setLiveBusCoordinates(null);
    }
  }, [selectedStop]);

  return (
    <BusStopContext.Provider
      value={{
        selectedStop,
        setSelectedStop,
        liveBusCoordinates,
        setLiveBusCoordinates,
      }}
    >
      {children}
    </BusStopContext.Provider>
  );
};

export const useBusStop = () => {
  return React.useContext(BusStopContext);
};
