import React from "react";
import { Layer, Source } from "react-map-gl";

import { getColor } from "@web/utils/get-color";
import { trpc } from "@web/utils/trpc";

type BusLinePointsMapLayerProps = {
  index: number;
  lineCode: string;
};

const BusLinePointsMapLayer = ({
  index,
  lineCode,
}: BusLinePointsMapLayerProps) => {
  const lineColor = React.useMemo(() => getColor(index), [index]);

  const busLinePointsQuery = trpc.getBusLinePoints.useQuery({ lineCode });

  const busLinePoints = React.useMemo(
    () => busLinePointsQuery.data ?? [],
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
