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
    null,
  );

  const [error, setError] = React.useState<GeolocationError | null>(null);

  const successCallback = React.useCallback((position: GeolocationPosition) => {
    setPosition(position.coords);
  }, []);

  const errorCallback = React.useCallback((error: GeolocationPositionError) => {
    let message = "";
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        message = t`Αρνήθηκες την πρόσβαση στην τοποθεσία σου.`;
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        message = t`Η τοποθεσία σου δεν είναι διαθέσιμη.`;
        break;
      case GeolocationPositionError.TIMEOUT:
        message = t`Το αίτημα για την πρόσβαση στην τοποθεσία σου έληξε.`;
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
      }),
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
      },
    );

    return () => {
      window.navigator.geolocation.clearWatch(watchId);
      void removeEventListener.then((remove) => remove?.());
    };
  }, [successCallback, errorCallback, permissionChangeCallback]);

  return { startLocationWatch, position, error };
};
