type SupportedLocation = {
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  range: number; // in kilometers
};

export const SupportedLocations: SupportedLocation[] = [
  {
    name: "Lamia, Greece",
    coordinates: {
      latitude: 38.90279,
      longitude: 22.434722,
    },
    range: 20,
  },
];
