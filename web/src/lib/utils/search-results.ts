import { GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import Fuse, { IFuseOptions } from "fuse.js";

import { DbSearchedBusStop } from "@api/types/models";

type FuseItem = GeocodeFeature | DbSearchedBusStop;

export type SearchItem = (
  | {
      type: "place";
      item: GeocodeFeature;
    }
  | {
      type: "busStop";
      item: DbSearchedBusStop;
    }
) & {
  score: number;
};

export const searchAndRankResults = (
  query: string,
  features: GeocodeFeature[],
  busStops: DbSearchedBusStop[],
) => {
  // Configure Fuse options
  const fuseOptions: IFuseOptions<FuseItem> = {
    includeScore: true,
    threshold: 0.4,
  };

  // Create Fuse instances
  const placeFuse = new Fuse(features, { ...fuseOptions, keys: ["text"] });
  const busStopFuse = new Fuse(busStops, { ...fuseOptions, keys: ["name"] });

  // Search places and get scored results
  const placeResults = placeFuse.search(query);
  const directPlaceMatches = placeResults.filter(
    (result) => result.score! < 0.3,
  );
  const indirectPlaceMatches = placeResults.filter(
    (result) => result.score! >= 0.3,
  );

  // Search bus stops
  const busStopResults = busStopFuse.search(query);

  // Combine results in desired order
  const combinedResults: SearchItem[] = [
    ...directPlaceMatches.map((result) => ({
      type: "place" as const,
      item: result.item,
      score: result.score ?? 0,
    })),
    ...busStopResults.map((result) => ({
      type: "busStop" as const,
      item: result.item,
      score: result.score ?? 0,
    })),
    ...indirectPlaceMatches.map((result) => ({
      type: "place" as const,
      item: result.item,
      score: result.score ?? 0,
    })),
  ];

  return combinedResults;
};
