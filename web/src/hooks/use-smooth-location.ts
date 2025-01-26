"use client";

import { useEffect, useRef, useState } from "react";

import usePrevious from "@web/hooks/use-previous";
import { type Coordinates } from "@web/types/coordinates";

type SmoothLocationResult = {
  smoothLocation: Coordinates;
};

type SmoothLocationOptions = {
  animationDuration: number;
  threshold?: number;
  easing?: (t: number) => number;
};

// Easing function - ease out cubic
const defaultEasing = (t: number): number => 1 - Math.pow(1 - t, 3);

export const useSmoothLocation = (
  location: Coordinates,
  options?: SmoothLocationOptions
): SmoothLocationResult => {
  const {
    animationDuration = 250,
    threshold = 0.000001,
    easing = defaultEasing,
  } = options ?? {};

  const animationFrame = useRef<number>(undefined);

  const prevLocation = usePrevious<Coordinates>(location);
  const [smoothLocation, setSmoothLocation] = useState<Coordinates>(location);

  const interpolateLocation = (
    startLocation: Coordinates,
    endLocation: Coordinates,
    duration: number
  ) => {
    let startTime: number;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        const easedProgress = easing(progress);

        const latitude =
          startLocation.latitude +
          (endLocation.latitude - startLocation.latitude) * easedProgress;

        const longitude =
          startLocation.longitude +
          (endLocation.longitude - startLocation.longitude) * easedProgress;

        setSmoothLocation({ latitude, longitude });
        animationFrame.current = requestAnimationFrame(step);
      } else {
        setSmoothLocation(endLocation);
      }
    };

    if (
      Math.abs(endLocation.latitude - startLocation.latitude) > threshold ||
      Math.abs(endLocation.longitude - startLocation.longitude) > threshold
    ) {
      animationFrame.current = requestAnimationFrame(step);
    }
  };

  useEffect(() => {
    if (prevLocation) {
      interpolateLocation(prevLocation, location, animationDuration);
    }

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [location, animationDuration]);

  return { smoothLocation: smoothLocation };
};
