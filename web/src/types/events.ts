import { type Coordinates } from "@web/types/coordinates";

export type MapFlyToDetail = {
  coordinates: Coordinates;
  overwriteZoom?: boolean;
  speed?: number;
};
