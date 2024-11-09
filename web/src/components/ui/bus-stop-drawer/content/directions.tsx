import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import { useDirections } from "@web/components/directions-context";
import Content from "@web/components/ui/bus-stop-drawer/content/elements";
import DynamicTitle from "@web/components/ui/dynamic-title";
import { PrettifyName } from "@web/lib/prettify-name";

type DirectionsContentProps = {
  isFullyOpen: boolean;
};

const DirectionsContent = ({ isFullyOpen }: DirectionsContentProps) => {
  const { selectedStop } = useBusStop();
  const { directions, resetDirections } = useDirections();

  const prettyStopName = React.useMemo(
    () => (selectedStop ? PrettifyName(selectedStop.name) : ""),
    [selectedStop],
  );

  const totalDuration = React.useMemo(
    () =>
      directions
        ? directions.routes.reduce((acc, route) => acc + route.duration, 0)
        : 0,
    [directions],
  );

  const totalDistance = React.useMemo(
    () =>
      directions
        ? directions.routes.reduce((acc, route) => acc + route.distance, 0)
        : 0,
    [directions],
  );

  const onBackPressed = React.useCallback(() => {
    resetDirections();
  }, [resetDirections]);

  if (!directions) {
    return null;
  }

  return (
    <>
      <Content.Header isFullyOpen={isFullyOpen}>
        <button className="cursor-pointer" onClick={onBackPressed}>
          <ArrowLeft />
        </button>
        <DynamicTitle title={`Προς ${prettyStopName}`} />
      </Content.Header>
      <Content.Body isFullyOpen={isFullyOpen}>
        <div className="flex items-center gap-2 text-center">
          <Detail
            label="Συνολική διάρκεια"
            text={dayjs.duration(totalDuration, "seconds").humanize()}
          />
          <Detail
            label="Συνολική απόσταση"
            text={`${Math.floor(totalDistance)} μέτρα`}
          />
        </div>

        <div>
          {directions.routes.map((route) => (
            <div
              key={route.geometry.coordinates.toString()}
              className="rounded-xl border p-4"
            >
              {route.distance} μέτρα, {route.duration} λεπτά
            </div>
          ))}
        </div>
      </Content.Body>
    </>
  );
};

export default DirectionsContent;

type DetailProps = {
  label: string;
  text: string;
};

const Detail = ({ label, text }: DetailProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-1 rounded-xl bg-gray-50 p-4">
      <span className="text-xs sm:text-sm">{label}</span>
      <span className="text-base font-extrabold sm:text-lg md:text-xl">
        {text}
      </span>
    </div>
  );
};
