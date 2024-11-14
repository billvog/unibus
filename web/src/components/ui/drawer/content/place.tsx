import { MapPin } from "lucide-react";
import React from "react";

import { usePlace } from "@web/components/place-context";
import Content from "@web/components/ui/drawer/content/elements";
import DynamicTitle from "@web/components/ui/dynamic-title";
import { formatFeatureAddress } from "@web/lib/utils/format-feature-address";

type PlaceContentProps = {
  isFullyOpen: boolean;
};

const PlaceContent = ({ isFullyOpen }: PlaceContentProps) => {
  const { selectedPlace } = usePlace();

  const formattedAddress = React.useMemo(
    () => (selectedPlace ? formatFeatureAddress(selectedPlace) : ""),
    [selectedPlace],
  );

  if (!selectedPlace) {
    return null;
  }

  return (
    <>
      <Content.Header isFullyOpen={isFullyOpen}>
        <DynamicTitle title={selectedPlace.text} />
      </Content.Header>
      <Content.Body isFullyOpen={isFullyOpen}>
        <div className="flex items-center gap-2">
          <MapPin size={20} className="text-red-500" />
          <span>{formattedAddress}</span>
        </div>
      </Content.Body>
    </>
  );
};

export default PlaceContent;
