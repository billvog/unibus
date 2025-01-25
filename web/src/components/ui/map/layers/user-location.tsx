"use client";

import { Marker } from "react-map-gl";

import { useUserLocation } from "@web/components/user-location-context";
import { useSmoothLocation } from "@web/hooks/use-smooth-location";

const UserLocationMapLayer = () => {
  const { userLocation } = useUserLocation();
  const { smoothLocation, isInitialized } = useSmoothLocation(userLocation);

  if (!userLocation || !isInitialized) {
    return null;
  }

  return (
    <Marker
      latitude={smoothLocation.latitude}
      longitude={smoothLocation.longitude}
    >
      <div className="text-3xl">📍</div>
    </Marker>
  );
};

export default UserLocationMapLayer;
