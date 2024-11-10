"use client";

import React, { createContext, useContext } from "react";
import { toast } from "sonner";

import { useGeolocation } from "@web/hooks/useGeolocation";
import { type Coordinates } from "@web/types/coordinates";

interface UserLocationContextType {
  userLocation: Coordinates | null;
}

const UserLocationContext = createContext<UserLocationContextType | null>(null);

export function UserLocationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showedError, setShowedError] = React.useState(false);

  const geolocation = useGeolocation();

  React.useEffect(() => {
    if (showedError) {
      return;
    }

    // Show an error message if location could not be
    // retrieved, but skip the error if the user denied
    if (
      geolocation.error &&
      geolocation.error.code !== GeolocationPositionError.PERMISSION_DENIED
    ) {
      toast.error(geolocation.error.message);
      setShowedError(true);
    }
  }, [showedError, geolocation.error]);

  return (
    <UserLocationContext.Provider
      value={{ userLocation: geolocation.position }}
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
