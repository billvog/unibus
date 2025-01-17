import { type Position } from "geojson";
import React from "react";
import { Layer, Marker, Source } from "react-map-gl";

import { useDirections } from "@web/components/directions-context";
import ManeuverIcon from "@web/components/ui/map/layers/directions/maneuver-icon";

const DirectionsMapLayer = () => {
  const { directions, maneuvers, activeManeuverId } = useDirections();

  const activeManeuver = React.useMemo(
    () =>
      maneuvers?.find((maneuver) => maneuver.id === activeManeuverId) ?? null,
    [maneuvers, activeManeuverId],
  );

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
      {activeManeuver && activeManeuver.maneuver.location.length === 2 && (
        <Marker
          key={activeManeuver.id}
          longitude={activeManeuver.maneuver.location[0]!}
          latitude={activeManeuver.maneuver.location[1]!}
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-purple-500 bg-white/80">
            <div className="h-4 w-4 rounded-full bg-purple-500" />
            <div className="absolute flex w-[200px] -translate-y-3/4 translate-x-[56%] items-center gap-2.5 rounded-xl rounded-bl-none bg-white p-3 text-xs font-semibold shadow-2xl shadow-black/10">
              <ManeuverIcon
                type={activeManeuver.maneuver.type}
                modifier={activeManeuver.maneuver.modifier}
              />
              <span className="text-balance">
                {activeManeuver.maneuver.instruction}
              </span>
            </div>
          </div>
        </Marker>
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
            "line-width": 4,
          }}
        />
      </Source>
    </>
  );
};

export default DirectionsMapLayer;
