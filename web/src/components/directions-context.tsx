"use client";

import { useLingui } from "@lingui/react/macro";
import {
  type Maneuver,
  type DirectionsResponse,
  type DirectionsWaypoint,
} from "@mapbox/mapbox-sdk/services/directions";
import * as Sentry from "@sentry/nextjs";
import {
  type UseMutateAsyncFunction,
  useMutation,
} from "@tanstack/react-query";
import * as turf from "@turf/distance";
import { type LineString, type MultiLineString } from "geojson";
import React, { createContext, useContext } from "react";
import { toast } from "sonner";

import { useUserLocation } from "@web/components/user-location-context";
import { mbxDirectionsClient } from "@web/lib/mapbox";
import { Events } from "@web/lib/utils/constants";
import { fixGreek } from "@web/lib/utils/fix-greek";
import { generateRandomId } from "@web/lib/utils/random-id";
import { type Coordinates } from "@web/types/coordinates";
import { type MapFlyToDetail } from "@web/types/events";

type DirectionsGeometry = MultiLineString | LineString;
type DirectionsManeuver = {
  id: string;
} & Maneuver;

type DirectionsContextType = {
  directions: DirectionsResponse<DirectionsGeometry> | null;
  maneuvers: DirectionsManeuver[];
  activeManeuverId: string | null;
  activeManeuver: DirectionsManeuver | null;
  resetDirections: () => void;
  getDirections: UseMutateAsyncFunction<
    DirectionsResponse<MultiLineString | LineString>,
    Error,
    DirectionsWaypoint[]
  >;
};

const DirectionsContext = createContext<DirectionsContextType | null>({
  directions: null,
  maneuvers: [],
  activeManeuverId: null,
  activeManeuver: null,
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
  const { t, i18n } = useLingui();

  const { userLocation } = useUserLocation();

  const [directions, setDirections] =
    React.useState<DirectionsContextType["directions"]>(null);

  const directionsSteps = React.useMemo(
    () => directions?.routes[0]?.legs[0]?.steps ?? [],
    [directions]
  );

  const maneuvers = React.useMemo(
    () =>
      directionsSteps.map(
        (step) =>
          ({
            ...step.maneuver,
            id: generateRandomId(),
            instruction: fixGreek(step.maneuver.instruction),
          }) as DirectionsManeuver
      ),
    [directionsSteps]
  );

  const activeManeuverId = React.useMemo(() => {
    if (!userLocation || !maneuvers.length) return null;

    const maneuverDistances = maneuvers.map((maneuver) => ({
      id: maneuver.id,
      distance: turf.distance(
        [userLocation.longitude, userLocation.latitude],
        [maneuver.location[0] ?? 0, maneuver.location[1] ?? 0],
        { units: "meters" }
      ),
    }));

    return maneuverDistances.reduce((closest, current) =>
      current.distance < closest.distance ? current : closest
    ).id;
  }, [maneuvers, userLocation]);

  const activeManeuver = React.useMemo(
    () =>
      maneuvers.find((maneuver) => maneuver.id === activeManeuverId) ?? null,
    [maneuvers, activeManeuverId]
  );

  const { mutateAsync: getDirections } = useMutation({
    mutationFn: async (waypoints: DirectionsWaypoint[]) => {
      const response = await mbxDirectionsClient
        .getDirections({
          waypoints,
          profile: "walking",
          geometries: "geojson",
          language: i18n.locale,
          steps: true,
        })
        .send();
      return response.body;
    },
    onSuccess: (data) => {
      setDirections(data);
    },
    onError: (error) => {
      Sentry.captureException(error);
      toast.error(
        t`Hm... Something went wrong trying to get directions. Please try again.`
      );
    },
  });

  const resetDirections = React.useCallback(() => {
    setDirections(null);
  }, []);

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
      window.addEventListener(event, handler)
    );

    return () => {
      // Unregister events.
      directionResetTriggerEvents.forEach((event) =>
        window.removeEventListener(event, handler)
      );
    };
  }, [resetDirections]);

  React.useEffect(() => {
    if (!activeManeuver) {
      return;
    }

    // If user has arrived at the destination, use user location.
    // Otherwise, use the maneuver location.
    const coordinates: Coordinates =
      activeManeuver.type === "arrive" && userLocation
        ? userLocation
        : {
            longitude: activeManeuver.location[0] ?? 0,
            latitude: activeManeuver.location[1] ?? 0,
          };

    // Fly map to coordinates.
    window.dispatchEvent(
      new CustomEvent<MapFlyToDetail>(Events.MapFlyTo, {
        detail: {
          coordinates,
          // Only overwrite zoom on first maneuver.
          overwriteZoom: activeManeuver.type === "depart",
        },
      })
    );
  }, [activeManeuver]);

  return (
    <DirectionsContext.Provider
      value={{
        directions,
        maneuvers,
        activeManeuverId,
        activeManeuver,
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
