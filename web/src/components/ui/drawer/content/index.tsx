import React from "react";

import { useBusStop } from "@web/components/bus-stop-context";
import { useDirections } from "@web/components/directions-context";
import { usePlace } from "@web/components/place-context";
import BusStopContent from "@web/components/ui/drawer/content/bus-stop";
import DirectionsContent from "@web/components/ui/drawer/content/directions";
import PlaceContent from "@web/components/ui/drawer/content/place";
import { type DrawerContentProps } from "@web/types/drawer";

type State = "busStop" | "directions" | "place";

const ContentMap: Record<State, React.ComponentType<DrawerContentProps>> = {
  directions: DirectionsContent,
  busStop: BusStopContent,
  place: PlaceContent,
};

const DrawerContent = (props: DrawerContentProps) => {
  const { selectedStopId } = useBusStop();
  const { directions } = useDirections();
  const { selectedPlace } = usePlace();

  const currentState: State | null = React.useMemo(() => {
    // Try to map the current state to a content component.
    if (directions) return "directions";
    if (selectedStopId) return "busStop";
    if (selectedPlace) return "place";

    // Close the drawer if no content is selected.
    props.closeDrawer();

    return null;
  }, [selectedStopId, directions, selectedPlace, props.closeDrawer]);

  const Content = React.useMemo(
    () => (currentState ? ContentMap[currentState] : null),
    [currentState],
  );

  return Content ? <Content {...props} /> : null;
};

export default DrawerContent;
