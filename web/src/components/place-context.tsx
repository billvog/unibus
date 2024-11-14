"use client";

import React, { useState } from "react";

import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";

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
