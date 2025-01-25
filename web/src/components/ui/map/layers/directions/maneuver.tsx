import type { Maneuver as ManeuverType } from "@mapbox/mapbox-sdk/services/directions";
import React from "react";
import { Marker } from "react-map-gl";

import ManeuverIcon from "@web/components/ui/map/layers/directions/maneuver-icon";

type ManeuverProps = {
  maneuver: ManeuverType;
};

const Maneuver = ({ maneuver }: ManeuverProps) => {
  if (maneuver.location.length !== 2) {
    return null;
  }

  return (
    <Marker longitude={maneuver.location[0]!} latitude={maneuver.location[1]!}>
      <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-purple-500/80 bg-white/80">
        <div className="h-4 w-4 rounded-full bg-purple-500/80" />
        <div className="absolute flex w-[200px] -translate-y-3/4 translate-x-[56%] items-center gap-2.5 rounded-xl rounded-bl-none bg-white p-3 text-xs font-semibold shadow-2xl shadow-black/10">
          <ManeuverIcon type={maneuver.type} modifier={maneuver.modifier} />
          <span className="text-balance">{maneuver.instruction}</span>
        </div>
      </div>
    </Marker>
  );
};

export default Maneuver;
