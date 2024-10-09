import React from "react";

export const useGeolocation = () => {
  const [position, setPosition] = React.useState<GeolocationCoordinates | null>(
    null,
  );

  const [error, setError] = React.useState<string | null>(null);

  const successCallback = React.useCallback((position: GeolocationPosition) => {
    setPosition(position.coords);
  }, []);

  const errorCallback = React.useCallback((error: GeolocationPositionError) => {
    let message = "";
    switch (error.code) {
      case GeolocationPositionError.PERMISSION_DENIED:
        message = "You denied access to your location.";
        break;
      case GeolocationPositionError.POSITION_UNAVAILABLE:
        message = "Your location information is unavailable.";
        break;
      case GeolocationPositionError.TIMEOUT:
        message = "The request to get your location timed out.";
        break;
    }

    setError(message);
  }, []);

  React.useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
    );
  }, []);

  return { position, error };
};
