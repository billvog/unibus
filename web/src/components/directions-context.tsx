"use client";

import { useLingui } from "@lingui/react/macro";
import {
  type Maneuver,
  type DirectionsResponse,
  type DirectionsWaypoint,
} from "@mapbox/mapbox-sdk/services/directions";
import * as turf from "@turf/distance";
import { type LineString, type MultiLineString } from "geojson";
import React, { createContext, useContext } from "react";

import { useUserLocation } from "@web/components/user-location-context";
import { mbxDirectionsClient } from "@web/lib/mapbox";
import { Events } from "@web/lib/utils/constants";
import { fixGreek } from "@web/lib/utils/fix-greek";

type DirectionsGeometry = MultiLineString | LineString;
type DirectionsManeuver = {
  id: string;
  maneuver: Maneuver;
};

interface DirectionsContextType {
  directions: DirectionsResponse<DirectionsGeometry> | null;
  maneuvers: DirectionsManeuver[];
  activeManeuverId: string | null;
  resetDirections: () => void;
  getDirections: (waypoints: DirectionsWaypoint[]) => Promise<void>;
}

const DirectionsContext = createContext<DirectionsContextType | null>({
  directions: null,
  maneuvers: [],
  activeManeuverId: null,
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
  const { i18n } = useLingui();

  const { userLocation } = useUserLocation();

  const [directions, setDirections] =
    React.useState<DirectionsContextType["directions"]>(null);

  const directionsSteps = React.useMemo(
    () => directions?.routes[0]?.legs[0]?.steps ?? [],
    [directions],
  );

  const maneuvers = React.useMemo(
    () =>
      directionsSteps.map(
        (step) =>
          ({
            id: crypto.randomUUID(),
            maneuver: {
              ...step.maneuver,
              instruction: fixGreek(step.maneuver.instruction),
            },
          }) as DirectionsManeuver,
      ),
    [directionsSteps],
  );

  const activeManeuverId = React.useMemo(() => {
    if (!userLocation || !maneuvers.length) return null;

    const maneuverDistances = maneuvers.map(({ id, maneuver }) => ({
      id,
      distance: turf.distance(
        [userLocation.longitude, userLocation.latitude],
        [maneuver.location[0] ?? 0, maneuver.location[1] ?? 0],
        { units: "meters" },
      ),
    }));

    return maneuverDistances.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest,
    ).id;
  }, [maneuvers, userLocation]);

  const resetDirections = React.useCallback(() => {
    setDirections(null);
  }, []);

  const getDirections = React.useCallback(
    async (waypoints: DirectionsWaypoint[]) => {
      const response = await mbxDirectionsClient
        .getDirections({
          waypoints,
          profile: "walking",
          geometries: "geojson",
          language: i18n.locale,
          steps: true,
        })
        .send();

      setDirections(response.body);
    },
    [i18n.locale],
  );

  // Reset directions when selected stop or place changes.
  React.useEffect(() => {
    const handler = () => {
      resetDirections();
    };

    // Events that trigger a reset of the directions.
    const directionResetTriggerEvents = [
      Events.BusStopChanged,
      Events.PlaceChanged,
    ];

    // Register events.
    directionResetTriggerEvents.forEach((event) =>
      window.addEventListener(event, handler),
    );

    return () => {
      // Unregister events.
      directionResetTriggerEvents.forEach((event) =>
        window.removeEventListener(event, handler),
      );
    };
  }, [resetDirections]);

  return (
    <DirectionsContext.Provider
      value={{
        directions,
        maneuvers,
        activeManeuverId,
        resetDirections,
        getDirections,
      }}
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
