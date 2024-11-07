import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import { useDirections } from "@web/components/directions-context";
import ActionButton from "@web/components/ui/bus-stop-drawer/action-button";
import { useUserLocation } from "@web/components/user-location-context";
import { calculateWalkingDistance } from "@web/lib/walking-distance";

type DirectionsButtonProps = {
  isFullyOpen: boolean;
};

const DirectionsButton = ({ isFullyOpen }: DirectionsButtonProps) => {
  const { userLocation } = useUserLocation();
  const { selectedStop } = useBusStop();
  const { getDirections } = useDirections();

  const [isDirectionsLoading, startDirectionsTransition] =
    React.useTransition();

  const walkingTime = React.useMemo(() => {
    if (!selectedStop || !userLocation) {
      return null;
    }

    const distance = calculateWalkingDistance(userLocation, {
      latitude: selectedStop.location.y,
      longitude: selectedStop.location.x,
    });

    return distance.walkingTime;
  }, [selectedStop, userLocation]);

  const directionsPressed = React.useCallback(() => {
    if (!userLocation || !selectedStop) {
      return;
    }

    // Fetch directions with transition.
    startDirectionsTransition(() =>
      getDirections([
        {
          coordinates: [userLocation.longitude, userLocation.latitude],
        },
        {
          coordinates: [selectedStop.location.x, selectedStop.location.y],
        },
      ]),
    );
  }, [userLocation, selectedStop, getDirections, startDirectionsTransition]);

  if (!walkingTime) {
    return null;
  }

  return (
    <ActionButton
      icon={<span>🚶‍♂️</span>}
      label={`${walkingTime} λεπτ${walkingTime > 1 ? "ά" : "ό"}`}
      isCompact={!isFullyOpen}
      loading={isDirectionsLoading}
      onClick={directionsPressed}
    />
  );
};

export default DirectionsButton;
