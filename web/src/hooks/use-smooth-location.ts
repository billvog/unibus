import { type SpringOptions, useSpring, useMotionValue } from "motion/react";
import { useState, useEffect } from "react";

import { type Coordinates } from "@web/types/coordinates";

const springOptions: SpringOptions = {
  stiffness: 100,
  damping: 20,
};

type UseSmoothLocationResult = {
  smoothLocation: Coordinates;
  isInitialized: boolean;
};

export const useSmoothLocation = (
  location: Coordinates | null
): UseSmoothLocationResult => {
  const [isInitialized, setIsInitialized] = useState(false);

  const latMotionValue = useMotionValue(location?.latitude ?? 0);
  const lngMotionValue = useMotionValue(location?.longitude ?? 0);

  const smoothLat = useSpring(latMotionValue, springOptions);
  const smoothLng = useSpring(lngMotionValue, springOptions);

  useEffect(() => {
    if (!location) return;

    latMotionValue.set(location.latitude);
    lngMotionValue.set(location.longitude);

    if (!isInitialized) {
      setIsInitialized(true);
    }
  }, [location, latMotionValue, lngMotionValue]);

  return {
    isInitialized,
    smoothLocation: {
      latitude: smoothLat.get(),
      longitude: smoothLng.get(),
    },
  };
};
