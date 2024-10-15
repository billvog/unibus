import { useBusStop } from "@/components/bus-stop-context";
import BusLinePointsMapLayer from "@/components/ui/bus-line-points-map-layer";
import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { BusStop } from "@/types/citybus";
import { Coordinates } from "@/types/coordinates";
import * as turf from "@turf/distance";
import { Undo2 } from "lucide-react";
import { MapEvent } from "mapbox-gl";
import React from "react";
import MapGL, {
  Layer,
  MapMouseEvent,
  MapRef,
  Marker,
  Source,
} from "react-map-gl";

type MapProps = {
  busStops: BusStop[];
  onBusStopClick: (id: number) => void;
  userLocation: Coordinates | null;
};

const Map = ({ busStops, onBusStopClick, userLocation }: MapProps) => {
  const { selectedStop, liveBusCoordinates } = useBusStop();

  const [hasZoomedToUser, setHasZoomedToUser] = React.useState(false);
  const [canResetZoom, setCanResetZoom] = React.useState(false);

  const stopsGeojson = React.useMemo(
    () => ({
      type: "FeatureCollection",
      features: busStops.map((stop) => ({
        type: "Feature",
        properties: {
          id: stop.id,
          code: stop.code,
        },
        geometry: {
          type: "Point",
          coordinates: [stop.longitude, stop.latitude],
        },
      })),
    }),
    [busStops],
  );

  const mapRef = React.useRef<MapRef>(null);

  const mapFlyTo = React.useCallback(
    (coordinates: Coordinates) => {
      if (!mapRef.current) {
        return false;
      }

      const map = mapRef.current.getMap();
      const zoom = map.getZoom();

      map.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: zoom < 16 ? 16 : zoom,
      });

      return true;
    },
    [mapRef.current],
  );

  const onMapLoad = React.useCallback(() => {
    const eventHandler = (event: Event) => {
      const customEvent = event as CustomEvent<Coordinates>;
      mapFlyTo(customEvent.detail);
    };

    window.addEventListener("map:fly-to", eventHandler);

    return () => {
      window.removeEventListener("map:fly-to", eventHandler);
    };
  }, [mapFlyTo]);

  const onMapClick = React.useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      const stopId = feature?.properties?.id;

      if (!stopId) {
        return;
      }

      onBusStopClick(stopId);
    },
    [onBusStopClick],
  );

  const onMapMove = React.useCallback(
    (event: MapEvent) => {
      if (!userLocation) {
        setCanResetZoom(false);
        return;
      }

      const map = event.target;
      const mapLocation = map.getCenter();
      const mapZoom = map.getZoom();

      const distance = turf.distance(
        [mapLocation.lng, mapLocation.lat],
        [userLocation.longitude, userLocation.latitude],
        { units: "meters" },
      );

      const threshold = 300 * Math.pow(2, 16 - mapZoom);

      setCanResetZoom(distance > threshold);
    },
    [userLocation],
  );

  React.useEffect(() => {
    if (userLocation && !hasZoomedToUser) {
      const ok = mapFlyTo(userLocation);
      setHasZoomedToUser(ok);
    }
  }, [userLocation, hasZoomedToUser, mapFlyTo]);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current.getMap();
    map.on("click", "unclustered-point", onMapClick);

    return () => {
      map.off("click", "unclustered-point", onMapClick);
    };
  }, [mapRef.current, onMapClick]);

  React.useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = mapRef.current.getMap();
    map.on("move", onMapMove);

    return () => {
      map.off("move", onMapMove);
    };
  }, [mapRef.current, onMapMove]);

  return (
    <MapGL
      ref={mapRef}
      attributionControl={false}
      initialViewState={{
        longitude: 22.4337,
        latitude: 38.8997,
        zoom: 13,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      onLoad={onMapLoad}
      style={{ flex: 1 }}
    >
      {/* Reset zoom button, to return map to user's location, if any */}
      {canResetZoom && (
        <Button
          className="absolute bottom-4 right-4 gap-1"
          size="sm"
          onClick={() => userLocation && mapFlyTo(userLocation)}
        >
          <Undo2 size={14} />
          <span>Reset Zoom</span>
        </Button>
      )}

      {/* Draw line for selected bus stop */}
      {selectedStop &&
        selectedStop.lineCodes.map((lineCode, index) => (
          <BusLinePointsMapLayer
            key={lineCode}
            index={index}
            lineCode={lineCode}
          />
        ))}

      {/* Show live bus coordinates */}
      {liveBusCoordinates && (
        <Marker
          latitude={liveBusCoordinates.latitude}
          longitude={liveBusCoordinates.longitude}
        >
          <div className="text-4xl">🚌</div>
        </Marker>
      )}

      {/* Draw all bus stop */}
      <Source
        id="busStops"
        type="geojson"
        data={stopsGeojson}
        cluster={true}
        clusterMaxZoom={50}
        clusterRadius={50}
      >
        <Layer
          id="clusters"
          type="circle"
          source="busStops"
          filter={["has", "point_count"]}
          paint={{
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#51bbd6",
              100,
              "#f1f075",
              750,
              "#f28cb1",
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              20,
              100,
              30,
              750,
              40,
            ],
          }}
        />
        <Layer
          id="cluster-count"
          type="symbol"
          source="busStops"
          filter={["has", "point_count"]}
          layout={{
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12,
          }}
        />
        <Layer
          id="unclustered-point"
          type="circle"
          source="busStops"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-radius": 10,
            "circle-color": [
              "case",
              ["==", ["get", "id"], selectedStop?.id ?? null],
              "#b300ff",
              "#ff5e00",
            ],
          }}
        />
      </Source>
    </MapGL>
  );
};

export default Map;
