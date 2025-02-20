import { useLingui } from "@lingui/react/macro";
import React from "react";

import { Events } from "@web/lib/utils/constants";

type GeolocationError = {
  code: number;
  message: string;
};

export const useGeolocation = () => {
  const { t } = useLingui();

  const [position, setPosition] = React.useState<GeolocationCoordinates | null>(
    null
  );

  const [error, setError] = React.useState<GeolocationError | null>(null);

  const successCallback = React.useCallback((position: GeolocationPosition) => {
    setPosition(position.coords);
  }, []);

  const errorCallback = React.useCallback((error: GeolocationPositionError) => {
    let message = "";
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        message = t`You denied access to your location.`;
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        message = t`Your location information is unavailable.`;
        break;
      case GeolocationPositionError.TIMEOUT:
        message = t`The request to get your location timed out.`;
        break;
    }

    setError({
      code: error.code,
      message,
    });
  }, []);

  const permissionChangeCallback = React.useCallback((event: Event) => {
    const { state } = event.target as PermissionStatus;
    if (state === "prompt") {
      return;
    }

    // Capture event
    window.dispatchEvent(
      new CustomEvent(Events.Analytics.GeolocationPrompt, {
        detail: {
          geolocationState: state,
        },
      })
    );
  }, []);

  const startLocationWatch = React.useCallback(() => {
    if (typeof window === "undefined" || "navigator" in window === false) {
      return;
    }

    const removeEventListener = window.navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        result.addEventListener("change", permissionChangeCallback);
        return () => {
          result.removeEventListener("change", permissionChangeCallback);
        };
      })
      .catch(() => {
        // Do nothing
      });

    const watchId = window.navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      window.navigator.geolocation.clearWatch(watchId);
      void removeEventListener.then((remove) => remove?.());
    };
  }, [successCallback, errorCallback, permissionChangeCallback]);

  return { startLocationWatch, position, error };
};
