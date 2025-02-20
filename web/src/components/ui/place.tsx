import { type GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import { MapPin } from "lucide-react";
import React from "react";

import { formatFeatureAddress } from "@web/lib/utils/format-feature-address";

type PlaceProps = {
  feature: GeocodeFeature;
  onClick: () => void;
};

const Place = ({ feature, onClick }: PlaceProps) => {
  const formattedAddress = React.useMemo(
    () => formatFeatureAddress(feature),
    [feature]
  );

  return (
    <div
      className="flex cursor-pointer items-start gap-2 rounded-2xl bg-white px-4 py-5"
      onClick={onClick}
    >
      <MapPin size={18} className="text-red-500" />
      <div className="flex flex-col gap-2">
        <div className="text-lg font-extrabold leading-none">
          {feature.text}
        </div>
        <div className="text-xs font-semibold leading-none text-gray-500">
          {formattedAddress}
        </div>
      </div>
    </div>
  );
};

export default Place;
