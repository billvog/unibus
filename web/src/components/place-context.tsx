"use client";

import { type GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { Events } from "@web/lib/utils/constants";
import React, { useState } from "react";

type PlaceContextType = {
  selectedPlace: GeocodeFeature | null;
  setSelectedPlace: React.Dispatch<React.SetStateAction<GeocodeFeature | null>>;
};

const PlaceContext = React.createContext<PlaceContextType>({
  selectedPlace: null,
  setSelectedPlace: () => {
    throw new Error("setSelectedPlace function must be overridden");
  },
});

export const PlaceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceContextType["selectedPlace"]>(null);

  // React.useEffect(() => {
  //   if (!selectedPlace) {
  //     return;
  //   }

  //   // Capture event
  //   window.dispatchEvent(
  //     new CustomEvent(Events.Analytics.PlaceClick, {
  //       detail: {
  //         from: "Search",
  //         place: {
  //           id: selectedPlace.id,
  //           name: selectedPlace.text,
  //         },
  //       },
  //     }),
  //   );
  // }, [selectedPlace?.id]);

  // When the user selected a bus stop, we want to
  // reset the selected place.
  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handler = () => {
      setSelectedPlace(null);
    };

    window.addEventListener(Events.BusStopChanged, handler);

    return () => {
      window.removeEventListener(Events.BusStopChanged, handler);
    };
  }, []);

  return (
    <PlaceContext.Provider
      value={{
        selectedPlace,
        setSelectedPlace,
      }}
    >
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlace = () => {
  return React.useContext(PlaceContext);
};
