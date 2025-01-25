"use client";

import { type SpringOptions, useSpring } from "motion/react";
import { Marker } from "react-map-gl";

import { useUserLocation } from "@web/components/user-location-context";

const springOptions: SpringOptions = { stiffness: 100, damping: 20 };

const UserLocationMapLayer = () => {
  const { userLocation } = useUserLocation();

  const smoothLat = useSpring(userLocation?.latitude ?? 0, springOptions);
  const smoothLng = useSpring(userLocation?.longitude ?? 0, springOptions);

  if (!userLocation) {
    return null;
  }

  return (
    <Marker latitude={smoothLat.get()} longitude={smoothLng.get()}>
      <div className="text-3xl">📍</div>
    </Marker>
  );
};

export default UserLocationMapLayer;
