"use client";

import { type GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import React, { useState } from "react";

import { Events } from "@web/lib/utils/constants";

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

  // Emit an event when the selected place changes.
  React.useEffect(() => {
    if (!selectedPlace) {
      return;
    }

    window.dispatchEvent(new CustomEvent(Events.PlaceChanged));

    // Capture event
    window.dispatchEvent(
      new CustomEvent(Events.Analytics.PlaceClick, {
        detail: {
          from: "Search",
          place: {
            id: selectedPlace.id,
            name: selectedPlace.text,
          },
        },
      })
    );
  }, [selectedPlace]);

  // When the user selected a bus stop, we want to
  // reset the selected place.
  React.useEffect(() => {
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
