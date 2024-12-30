"use client";

import React, { createContext, useContext } from "react";
import { toast } from "sonner";

import { useGeolocation } from "@web/hooks/useGeolocation";
import { usePersistedState } from "@web/hooks/usePersistedState";
import { trpc } from "@web/lib/trpc";
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

  const { data: hasSupportedAgency } = trpc.hasSupportedAgency.useQuery(
    {
      location: {
        x: geolocation.position?.longitude ?? 0,
        y: geolocation.position?.latitude ?? 0,
      },
    },
    {
      enabled: isEnabled && geolocation.position !== null,
    },
  );

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
    if (hasSupportedAgency !== undefined) {
      setIsLocationSupported(hasSupportedAgency);
    }
  }, [hasSupportedAgency]);

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
