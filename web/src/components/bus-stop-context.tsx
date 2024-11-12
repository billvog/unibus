"use client";

import { type DbBusStop } from "@api/types/models";
import React, { useState } from "react";

import { Events } from "@web/lib/utils/constants";
import { trpc } from "@web/lib/trpc";
import { type Coordinates } from "@web/types/coordinates";

type BusStopContextType = {
  selectedStopId: DbBusStop["id"] | null;
  setSelectedStopId: React.Dispatch<
    React.SetStateAction<DbBusStop["id"] | null>
  >;
  selectedStop: DbBusStop | null;
  liveBusCoordinates: Coordinates | null;
  setLiveBusCoordinates: React.Dispatch<
    React.SetStateAction<Coordinates | null>
  >;
};

const BusStopContext = React.createContext<BusStopContextType>({
  selectedStopId: null,
  setSelectedStopId: () => {
    throw new Error("setSelectedStopId function must be overridden");
  },
  selectedStop: null,
  liveBusCoordinates: null,
  setLiveBusCoordinates: () => {
    throw new Error("setLiveBusCoordinates function must be overridden");
  },
});

export const BusStopProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedStopId, setSelectedStopId] = useState<DbBusStop["id"] | null>(
    null,
  );

  const [liveBusCoordinates, setLiveBusCoordinates] =
    useState<Coordinates | null>(null);

  const busStopQuery = trpc.busStop.get.useQuery(
    { stopId: selectedStopId ?? -1 },
    {
      enabled: !!selectedStopId,
    },
  );

  const selectedStop = React.useMemo(() => {
    if (!selectedStopId) {
      return null;
    }

    return busStopQuery.data ?? null;
  }, [selectedStopId, busStopQuery.data]);

  React.useEffect(() => {
    if (selectedStop === null) {
      setLiveBusCoordinates(null);
    }
  }, [selectedStop]);

  React.useEffect(() => {
    if (!selectedStop) {
      return;
    }

    // Capture event
    window.dispatchEvent(
      new CustomEvent(Events.Analytics.BusStopClick, {
        detail: {
          from: "Map",
          busStop: {
            id: selectedStop.id,
            name: selectedStop.name,
          },
        },
      }),
    );
  }, [selectedStop?.id]);

  return (
    <BusStopContext.Provider
      value={{
        selectedStopId,
        setSelectedStopId,
        selectedStop,
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
