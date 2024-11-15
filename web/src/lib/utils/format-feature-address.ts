import { type GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";

export const formatFeatureAddress = (feature: GeocodeFeature) => {
  const elements: string[] = [];

  if (feature.properties.address) {
    elements.push(feature.properties.address);
  }

  const city = feature.context.find((c) => c.id.startsWith("place"));
  if (city) {
    elements.push(city.text);
  }

  return elements.join(", ");
};
