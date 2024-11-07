import { type Position } from "geojson";
import React from "react";
import { Layer, Source } from "react-map-gl";

import { useDirections } from "@web/components/directions-context";

const DirectionsMapLayer = () => {
  const { directions } = useDirections();

  const directionsPointsGeojson = React.useMemo(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: (directions?.routes ?? []).flatMap(
          (route) => route.geometry.coordinates as Position[],
        ),
      },
    }),
    [directions],
  );

  if (!directions) {
    return null;
  }

  return (
    <Source id="directions" type="geojson" data={directionsPointsGeojson}>
      <Layer
        id="directions"
        type="line"
        source="directions"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": "#a75ade",
          "line-width": 4,
        }}
      />
    </Source>
  );
};

export default DirectionsMapLayer;
