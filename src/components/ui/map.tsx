import { useBusStop } from "@/components/bus-stop-context";
import BusLinePointsMapLayer from "@/components/ui/bus-line-points-map-layer";
import { env } from "@/env";
import { BusStop } from "@/types/citybus";
import React from "react";
import MapGL, { Layer, MapMouseEvent, MapRef, Source } from "react-map-gl";

type MapProps = {
  busStops: BusStop[];
  onBusStopClick: (id: number) => void;
};

const Map = ({ busStops, onBusStopClick }: MapProps) => {
  const { selectedStop } = useBusStop();

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

  const onMapClick = React.useCallback((event: MapMouseEvent) => {
    const feature = event.features?.[0];
    const stopId = feature?.properties?.id;

    if (!stopId) {
      return;
    }

    console.log("clicked", stopId);
    onBusStopClick(stopId);

    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const zoom = map.getZoom();

      map.flyTo({
        center: event.lngLat,
        zoom: zoom < 16 ? 16 : zoom,
      });
    }
  }, []);

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

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 22.4337,
        latitude: 38.8997,
        zoom: 13,
      }}
      style={{ flex: 1 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      {selectedStop &&
        selectedStop.lineCodes.map((lineCode, index) => (
          <BusLinePointsMapLayer
            key={lineCode}
            index={index}
            lineCode={lineCode}
          />
        ))}
      <Source
        id="busStops"
        type="geojson"
        data={stopsGeojson}
        cluster={true}
        clusterMaxZoom={20}
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
