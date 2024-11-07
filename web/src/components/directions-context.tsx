"use client";

import {
  type DirectionsResponse,
  type DirectionsWaypoint,
} from "@mapbox/mapbox-sdk/services/directions";
import { type LineString, type MultiLineString } from "geojson";
import React, { createContext, useContext } from "react";

import { mbxDirectionsClient } from "@web/lib/mapbox";

type DirectionsGeometry = MultiLineString | LineString;

interface DirectionsContextType {
  directions: DirectionsResponse<DirectionsGeometry> | null;
  resetDirections: () => void;
  getDirections: (waypoints: DirectionsWaypoint[]) => Promise<void>;
}

const DirectionsContext = createContext<DirectionsContextType | null>({
  directions: null,
  resetDirections: () => {
    throw new Error("resetDirections not implemented");
  },
  getDirections: async () => {
    throw new Error("getDirections not implemented");
  },
});

export function DirectionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [directions, setDirections] =
    React.useState<DirectionsContextType["directions"]>(null);

  const resetDirections = React.useCallback(() => {
    setDirections(null);
  }, []);

  const getDirections = React.useCallback(
    async (waypoints: DirectionsWaypoint[]) => {
      const response = await mbxDirectionsClient
        .getDirections({
          profile: "walking",
          geometries: "geojson",
          waypoints,
        })
        .send();

      setDirections(response.body);
    },
    [],
  );

  return (
    <DirectionsContext.Provider
      value={{ directions, resetDirections, getDirections }}
    >
      {children}
    </DirectionsContext.Provider>
  );
}

export function useDirections() {
  const context = useContext(DirectionsContext);
  if (!context) {
    throw new Error("useDirections must be used within a DirectionsProvider");
  }

  return context;
}
