export const CITYBUS_WEBSITE_URL = (city: string) =>
  `https://${city}.citybus.gr/el`;

export const CITYBUS_API_URL = (agencyCode: number) =>
  `https://rest.citybus.gr/api/v1/el/${agencyCode}`;

export const StorageKeys = {
  CitybusToken: "jwt-token",
};

export const Shortcuts = {
  FocusSearch: "/",
};

export const Events = {
  Analytics: {
    CitybusTokenGenerated: "citybus token generated",
    BusStopClick: "bus stop click",
    BusVehicleClick: "bus vehicle click",
    MapResetZoom: "map reset zoom",
    GeolocationPrompt: "geolocation prompt",
  },
};
