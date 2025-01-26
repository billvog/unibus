"use client";

import { Marker } from "react-map-gl";

import { useUserLocation } from "@web/components/user-location-context";
import { useSmoothLocation } from "@web/hooks/use-smooth-location";
import { type Coordinates } from "@web/types/coordinates";

type UserLocationMarkerProps = {
  location: Coordinates;
};

const UserLocationMarker = ({ location }: UserLocationMarkerProps) => {
  const { smoothLocation } = useSmoothLocation(location);
  return (
    <Marker
      latitude={smoothLocation.latitude}
      longitude={smoothLocation.longitude}
    >
      <div className="text-3xl">📍</div>
    </Marker>
  );
};

const UserLocationMapLayer = () => {
  const { userLocation } = useUserLocation();
  if (!userLocation) return null;
  return <UserLocationMarker location={userLocation} />;
};

export default UserLocationMapLayer;
