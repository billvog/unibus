import * as turf from "@turf/distance";

import { type Coordinates } from "@web/types/coordinates";

// Function to calculate distance and estimated walking time
export function calculateWalkingDistance(
  userLocation: Coordinates,
  stopLocation: Coordinates,
) {
  function toArray(coords: Coordinates) {
    return [coords.longitude, coords.latitude];
  }

  // Calculate distance in meters
  const distance = turf.distance(toArray(userLocation), toArray(stopLocation), {
    units: "meters",
  });

  // Estimate walking time in minutes (assuming 1.4 m/s walking speed)
  const walkingSpeed = 1.2; // meters per second
  const walkingTime = Math.floor(distance / walkingSpeed / 60);

  return { distance, walkingTime };
}
