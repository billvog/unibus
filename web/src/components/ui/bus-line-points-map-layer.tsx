import { type DbBusLine } from "@api/types/models";
import React from "react";
import { Layer, Source } from "react-map-gl";

import { getColor } from "@web/lib/get-color";
import { trpc } from "@web/lib/trpc";

type BusLinePointsMapLayerProps = {
  index: number;
  busLine: DbBusLine;
};

const BusLinePointsMapLayer = ({
  index,
  busLine,
}: BusLinePointsMapLayerProps) => {
  const lineColor = React.useMemo(() => getColor(index), [index]);

  const busLinePointsQuery = trpc.getBusLinePoints.useQuery({
    lineId: busLine.id,
  });

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
          Number(point.location.x),
          Number(point.location.y),
        ]),
      },
    }),
    [busLinePoints],
  );

  return (
    <Source
      id={`busLine:${busLine.id}`}
      type="geojson"
      data={linePointsGeojson}
    >
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
