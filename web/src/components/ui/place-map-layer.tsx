import { usePlace } from "@web/components/place-context";
import { MapPin } from "lucide-react";
import { Marker } from "react-map-gl";

const PlaceMapLayer = () => {
  const { selectedPlace } = usePlace();

  if (!selectedPlace) {
    return null;
  }

  return (
    <Marker
      longitude={selectedPlace.geometry.coordinates[0]!}
      latitude={selectedPlace.geometry.coordinates[1]!}
    >
      <div className="aspect-square rounded-full bg-white/70 p-1 text-red-500 backdrop-blur-sm backdrop-filter">
        <MapPin size={28} />
      </div>
    </Marker>
  );
};

export default PlaceMapLayer;
