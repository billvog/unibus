import dayjs from "dayjs";
import { ArrowLeft } from "lucide-react";
import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import { useDirections } from "@web/components/directions-context";
import { Detail } from "@web/components/ui/drawer/content/detail";
import Content from "@web/components/ui/drawer/content/elements";
import DynamicTitle from "@web/components/ui/dynamic-title";
import ManeuverIcon from "@web/components/ui/map/layers/directions/maneuver-icon";
import { formatDistance } from "@web/lib/utils/format-distance";
import { PrettifyName } from "@web/lib/utils/prettify-name";
import { cn } from "@web/lib/utils/tailwind";
import { type DrawerContentProps } from "@web/types/drawer";

const DirectionsContent = ({ isFullyOpen }: DrawerContentProps) => {
  const { selectedStop } = useBusStop();
  const { directions, maneuvers, activeManeuverId, resetDirections } =
    useDirections();

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

  const totalDistanceFormatted = React.useMemo(() => {
    if (!directions) {
      return "";
    }

    const distance = directions.routes.reduce(
      (acc, route) => acc + route.distance,
      0,
    );

    return formatDistance(distance);
  }, [directions]);

  React.useEffect(() => {
    if (activeManeuverId) {
      const element = document.getElementById(`maneuver-${activeManeuverId}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [activeManeuverId]);

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
          <Detail label="Συνολική απόσταση" text={totalDistanceFormatted} />
        </div>

        <div className="mt-2 space-y-4 rounded-2xl border p-6">
          <span className="text-lg font-bold">Οδηγίες:</span>
          <div
            className={cn(
              "relative flex max-h-[200px] flex-col gap-8 overflow-hidden overflow-y-hidden",
              maneuvers.length > 4 && "fade-bottom",
            )}
          >
            <div className="absolute bottom-5 left-[11px] top-5 border-r-2 border-dotted" />
            {maneuvers.map(({ id, maneuver }) => (
              <div
                id={`maneuver-${id}`}
                key={id}
                className={cn(
                  "flex items-center gap-4 text-sm md:text-base",
                  id === activeManeuverId ? "text-black" : "text-black/40",
                )}
              >
                <div className="z-10 bg-white ring-8 ring-white">
                  <ManeuverIcon
                    type={maneuver.type}
                    modifier={maneuver.modifier}
                  />
                </div>
                <div>{maneuver.instruction}</div>
              </div>
            ))}
          </div>
        </div>
      </Content.Body>
    </>
  );
};

export default DirectionsContent;
