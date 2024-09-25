"use client";

import React, { useState } from "react";

type BusStopContextType = {
  selectedId: number | null;
  setSelectedId: React.Dispatch<React.SetStateAction<number | null>>;
};

const BusStopContext = React.createContext<BusStopContextType>({
  selectedId: null,
  setSelectedId: () => {},
});

export const BusStopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <BusStopContext.Provider
      value={{
        selectedId,
        setSelectedId,
      }}
    >
      {children}
    </BusStopContext.Provider>
  );
};

export const useBusStop = () => {
  return React.useContext(BusStopContext);
};
