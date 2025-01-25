"use client";

import { type DbMassBusStop } from "@api/types/models";
import { Trans } from "@lingui/react/macro";
import * as turf from "@turf/distance";
import { Undo2 } from "lucide-react";
import { type MapEvent } from "mapbox-gl";
import React from "react";
import MapGL, {
  Layer,
  type MapMouseEvent,
  type MapRef,
  Marker,
  Source,
} from "react-map-gl";

import { useBusStop } from "@web/components/bus-stop-context";
import { Button } from "@web/components/ui/button";
import BusLinePointsMapLayer from "@web/components/ui/map/layers/bus-line-points";
import DirectionsMapLayer from "@web/components/ui/map/layers/directions";
import PlaceMapLayer from "@web/components/ui/map/layers/place";
import UserLocationMapLayer from "@web/components/ui/map/layers/user-location";
import { useUser } from "@web/components/user-context";
import { useUserLocation } from "@web/components/user-location-context";
import { env } from "@web/env";
import { trpc } from "@web/lib/trpc";
import { Events } from "@web/lib/utils/constants";
import { type Coordinates } from "@web/types/coordinates";
import { type MapFlyToDetail } from "@web/types/events";

type MapProps = {
  busStops: DbMassBusStop[];
  onBusStopClick: (id: number) => void;
  onLoadFinish?: () => void;
};

const Map = ({ busStops, onBusStopClick, onLoadFinish }: MapProps) => {
  const { user } = useUser();
  const { userLocation } = useUserLocation();
  const { selectedStop, liveBusCoordinates } = useBusStop();

  const [hasZoomedToUser, setHasZoomedToUser] = React.useState(false);
  const [canResetZoom, setCanResetZoom] = React.useState(false);

  const { data: favoriteBusStops } = trpc.busStop.favorites.useQuery(
    undefined,
    {
      enabled: !!user,
    }
  );

  const stopsGeojson = React.useMemo(() => {
    const stopsToGeojson = (stops: DbMassBusStop[]) =>
      stops.map((stop) => ({
        type: "Feature",
        properties: {
          id: stop.id,
        },
        geometry: {
          type: "Point",
          coordinates: [stop.location.x, stop.location.y],
        },
      }));

    return {
      all: {
        type: "FeatureCollection",
        features: stopsToGeojson(
          favoriteBusStops
            ? busStops.filter((stop) => !favoriteBusStops.includes(stop.id))
            : busStops
        ),
      },
      favorites: favoriteBusStops && {
        type: "FeatureCollection",
        features: stopsToGeojson(
          busStops.filter((stop) => favoriteBusStops.includes(stop.id))
        ),
      },
    };
  }, [busStops, favoriteBusStops]);

  const mapRef = React.useRef<MapRef>(null);

  const mapFlyTo = React.useCallback(
    (
      coordinates: Coordinates,
      options?: { overwriteZoom?: boolean; speed?: number }
    ) => {
      if (!mapRef.current) {
        return false;
      }

      const overwriteZoom = options?.overwriteZoom ?? true;
      const speed = options?.speed ?? 1;

      const map = mapRef.current.getMap();
      const zoom = map.getZoom();

      map.flyTo({
        center: [coordinates.longitude, coordinates.latitude],
        zoom: overwriteZoom && zoom < 16 ? 17 : zoom,
        speed: speed > 0 ? speed : 1,
        animate: speed > 0,
      });

      return true;
    },
    []
  );

  const onMapClick = React.useCallback(
    (event: MapMouseEvent) => {
      const feature = event.features?.[0];
      const stopId = feature?.properties?.id as number | undefined;

      if (!stopId) {
        return;
      }

      onBusStopClick(stopId);
    },
    [onBusStopClick]
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
        { units: "meters" }
      );

      const threshold = 300 * Math.pow(2, 16 - mapZoom);

      setCanResetZoom(distance > threshold);
    },
    [userLocation]
  );

  const onMapLoad = React.useCallback(() => {
    if (!mapRef.current) {
      return;
    }

    // Add 200ms timeout for smoother transition
    setTimeout(() => {
      onLoadFinish?.();
    }, 200);

    const handleMapFlyTo = (event: Event) => {
      const customEvent = event as CustomEvent<MapFlyToDetail>;
      mapFlyTo(customEvent.detail.coordinates, {
        overwriteZoom: customEvent.detail.overwriteZoom,
        speed: customEvent.detail.speed,
      });
    };

    const map = mapRef.current.getMap();

    map.on("move", onMapMove);
    map.on("click", "unclustered-point", onMapClick);
    map.on("click", "unclustered-point.favorite", onMapClick);
    window.addEventListener(Events.MapFlyTo, handleMapFlyTo);

    return () => {
      map.off("move", onMapMove);
      map.off("click", "unclustered-point", onMapClick);
      map.off("click", "unclustered-point.favorite", onMapClick);
      window.removeEventListener(Events.MapFlyTo, handleMapFlyTo);
    };
  }, [onLoadFinish, mapFlyTo, onMapMove, onMapClick]);

  const onResetZoom = React.useCallback(() => {
    if (!userLocation) {
      return;
    }

    mapFlyTo(userLocation);

    // Capture event
    window.dispatchEvent(new CustomEvent(Events.Analytics.MapResetZoom));
  }, [userLocation, mapFlyTo]);

  // When we get user's location for the first time, zoom to it
  React.useEffect(() => {
    if (userLocation && !hasZoomedToUser) {
      setTimeout(() => {
        const ok = mapFlyTo(userLocation, {
          speed: 16,
        });

        setHasZoomedToUser(ok);
      }, 500);
    }
  }, [userLocation, hasZoomedToUser, mapFlyTo]);

  React.useEffect(() => {
    onMapLoad();
  }, [onMapLoad]);

  return (
    <MapGL
      ref={mapRef}
      attributionControl={false}
      initialViewState={{
        // Hardcoded to Greece
        longitude: 23.7275,
        latitude: 37.9838,
        zoom: 5,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      onLoad={onMapLoad}
      style={{ flex: 1 }}
    >
      {/* Reset zoom button, to return map to user's location, if any */}
      {canResetZoom && (
        <Button
          className="absolute bottom-5 right-5 gap-1"
          size="sm"
          onClick={onResetZoom}
        >
          <Undo2 size={14} />
          <span>
            <Trans>Reset</Trans>
          </span>
        </Button>
      )}

      {/* Draw line for selected bus stop */}
      {selectedStop?.busLines.map(({ busLine }, index) => (
        <BusLinePointsMapLayer
          key={busLine.code}
          index={index}
          busLine={busLine}
        />
      ))}

      {/* Directions */}
      <DirectionsMapLayer />

      {/* Place */}
      <PlaceMapLayer />

      {/* Show user's location marker, if any */}
      {userLocation && <UserLocationMapLayer />}

      {/* Show live bus coordinates */}
      {liveBusCoordinates && (
        <Marker
          latitude={liveBusCoordinates.latitude}
          longitude={liveBusCoordinates.longitude}
        >
          <div className="text-4xl">🚌</div>
        </Marker>
      )}

      {/* Draw favorite bus stops (unclustered) */}
      {stopsGeojson.favorites && (
        <Source
          id="bus-stops.favorite"
          type="geojson"
          data={stopsGeojson.favorites}
        >
          <Layer
            id="unclustered-point.favorite"
            type="circle"
            source="bus-stops.favorite"
            paint={{
              "circle-radius": 10,
              "circle-color": [
                "case",
                ["==", ["get", "id"], selectedStop?.id ?? null],
                "#6d76aa",
                "#ffc400",
              ],
              "circle-stroke-color": "#fff",
              "circle-stroke-width": 2,
            }}
          />
        </Source>
      )}

      {/* Draw all bus stops */}
      <Source
        id="bus-stops"
        type="geojson"
        data={stopsGeojson.all}
        cluster={true}
        clusterMaxZoom={15}
        clusterRadius={30}
      >
        <Layer
          id="clusters"
          type="circle"
          source="bus-stops"
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
          source="bus-stops"
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
          source="bus-stops"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-radius": 10,
            "circle-color": [
              "case",
              ["==", ["get", "id"], selectedStop?.id ?? null],
              "#b300ff",
              "#ff5e00",
            ],
            "circle-stroke-color": "#fff",
            "circle-stroke-width": 2,
          }}
        />
      </Source>
    </MapGL>
  );
};

export default Map;
