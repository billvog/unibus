import { type Position } from "geojson";
import React from "react";
import { Layer, Source } from "react-map-gl";

import { useDirections } from "@web/components/directions-context";
import Maneuver from "@web/components/ui/map/layers/directions/maneuver";

const DirectionsMapLayer = () => {
  const { directions, activeManeuver } = useDirections();

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
    <>
      {activeManeuver && (
        <Maneuver key={activeManeuver.id} maneuver={activeManeuver} />
      )}

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
            "line-width": 6,
            "line-opacity": 0.7,
          }}
        />
      </Source>
    </>
  );
};

export default DirectionsMapLayer;
