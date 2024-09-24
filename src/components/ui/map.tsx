import { env } from "@/env";
import { BusStop } from "@/types/citybus";
import { MapPin } from "lucide-react";
import React from "react";
import MapGL, { Marker } from "react-map-gl";
import {} from "mapbox-gl";

type MapProps = {
  busStops: BusStop[];
};

const Map = ({ busStops }: MapProps) => {
  return (
    <MapGL
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 22.4337,
        latitude: 38.8997,
        zoom: 13,
      }}
      style={{ flex: 1 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {busStops.map((stop) => (
        <Marker
          longitude={stop.longitude}
          latitude={stop.latitude}
          anchor="bottom"
          onClick={() => {
            console.log("clicked", stop.code);
          }}
        >
          <div className="rounded-full bg-orange-600/90 p-2">
            <MapPin size={24} color="white" />
          </div>
        </Marker>
      ))}
    </MapGL>
  );
};

export default Map;
