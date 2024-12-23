"use client";

import { distance } from "@turf/distance";
import React, { createContext, useContext } from "react";
import { toast } from "sonner";

import { useGeolocation } from "@web/hooks/useGeolocation";
import { usePersistedState } from "@web/hooks/usePersistedState";
import { SupportedLocations } from "@web/lib/supported-locations";
import { type Coordinates } from "@web/types/coordinates";

interface UserLocationContextType {
  userLocation: Coordinates | null;
  isLocationEnabled: boolean;
  isLocationSupported: boolean;
  enableLocation: () => void;
}

const UserLocationContext = createContext<UserLocationContextType | null>(null);

export function UserLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // A flag to determine if the user has enabled location.
  // **Note**: This doesn't mean that we have permission to access the location.
  // It just means that the user has been asked for location, and pressed "Enable".
  const [isEnabled, setIsEnabled] = usePersistedState(
    "user-location:enabled",
    false,
  );

  // A flag to determine if the user's location is supported from unibus.
  const [isLocationSupported, setIsLocationSupported] = React.useState(false);

  const [showedError, setShowedError] = React.useState(false);

  const geolocation = useGeolocation();

  React.useEffect(() => {
    // If the location is enabled, start the location watch.
    // This will prompt the user for location access.
    if (isEnabled) {
      geolocation.startLocationWatch();
    }
  }, [isEnabled, geolocation.startLocationWatch]);

  React.useEffect(() => {
    if (showedError) {
      return;
    }

    // Show an error message if location could not be
    // retrieved, but skip the error if the user denied access.
    if (
      geolocation.error &&
      geolocation.error.code !== GeolocationPositionError.PERMISSION_DENIED
    ) {
      toast.error(geolocation.error.message);
      setShowedError(true);
    }
  }, [showedError, geolocation.error]);

  const enableLocation = React.useCallback(() => {
    // Set that we have asked for location.
    // Then the useEffect will start the location watch.
    setIsEnabled(true);
  }, [setIsEnabled]);

  React.useEffect(() => {
    // If the user has enabled location, and we have a position,
    // check if the location is supported.
    if (isEnabled && geolocation.position) {
      let isSupported = false;

      SupportedLocations.forEach((location) => {
        const d = distance(
          [location.coordinates.longitude, location.coordinates.latitude],
          [geolocation.position!.longitude, geolocation.position!.latitude],
          {
            units: "kilometers",
          },
        );

        if (d < location.range) {
          isSupported = true;
        }
      });

      setIsLocationSupported(isSupported);
    }
  }, [isEnabled, geolocation.position]);

  return (
    <UserLocationContext.Provider
      value={{
        userLocation: geolocation.position,
        isLocationEnabled: isEnabled,
        isLocationSupported,
        enableLocation,
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}

export function useUserLocation() {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error(
      "useUserLocation must be used within a UserLocationProvider",
    );
  }

  return context;
}
