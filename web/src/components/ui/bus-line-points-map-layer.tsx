import { GetBusLinePoints } from "@/actions/get-bus-line-points";
import { useCitybusToken } from "@/components/citybus-token-context";
import { getColor } from "@/utils/get-color";
import { useQuery } from "@tanstack/react-query";
import React, { useId } from "react";
import { Layer, Source } from "react-map-gl";

type BusLinePointsMapLayerProps = {
  index: number;
  lineCode: string;
};

const BusLinePointsMapLayer = ({
  index,
  lineCode,
}: BusLinePointsMapLayerProps) => {
  const { token } = useCitybusToken();

  const lineColor = React.useMemo(() => getColor(index), [index]);

  const busLinePointsQuery = useQuery({
    queryKey: ["busLine", lineCode, "points"],
    queryFn: () => GetBusLinePoints(token!, lineCode),
    enabled: !!token && !!lineCode,
  });

  const busLinePoints = React.useMemo(
    () =>
      busLinePointsQuery.data?.ok ? busLinePointsQuery.data.linePoints : [],
    [busLinePointsQuery.data],
  );

  const linePointsGeojson = React.useMemo(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: busLinePoints.map((point) => [
          Number(point.longitude),
          Number(point.latitude),
        ]),
      },
    }),
    [busLinePoints],
  );

  return (
    <Source id={`busLine:${lineCode}`} type="geojson" data={linePointsGeojson}>
      <Layer
        id="busLine"
        type="line"
        source="busLinePoints"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": lineColor,
          "line-width": 4,
        }}
      />
    </Source>
  );
};

export default BusLinePointsMapLayer;
