import {
  type ManeuverModifier,
  type ManeuverType,
} from "@mapbox/mapbox-sdk/services/directions";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowLeftFromLine,
  ArrowRight,
  ArrowRightFromLine,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  CornerLeftDown,
  CornerRightDown,
  CornerUpLeft,
  CornerUpRight,
  Merge,
  MoveLeft,
  MoveRight,
  Navigation,
  RefreshCw,
  Split,
  SplitSquareHorizontal,
  Undo2,
  type LucideIcon,
} from "lucide-react";

const getManeuverIcon = (
  type: ManeuverType,
  modifier: ManeuverModifier | undefined
): LucideIcon => {
  const modifierMap: Partial<
    Record<ManeuverType, Partial<Record<ManeuverModifier, LucideIcon>>>
  > = {
    turn: {
      left: ArrowLeft,
      right: ArrowRight,
      straight: ArrowUp,
      "sharp left": CornerLeftDown,
      "sharp right": CornerRightDown,
      "slight left": ChevronLeft,
      "slight right": ChevronRight,
      uturn: Undo2,
    },
    merge: {
      left: MoveLeft,
      right: MoveRight,
    },
    "on ramp": {
      left: CornerUpLeft,
      right: CornerUpRight,
    },
    "off ramp": {
      left: CornerLeftDown,
      right: CornerRightDown,
    },
    fork: {
      left: ArrowLeft,
      right: ArrowRight,
      "slight left": ChevronLeft,
      "slight right": ChevronRight,
    },
  };

  const baseIconMap: Record<ManeuverType, LucideIcon> = {
    turn: ArrowRight,
    "new name": MoveRight,
    depart: Navigation,
    arrive: CircleDot,
    merge: Merge,
    "on ramp": CornerUpRight,
    "off ramp": CornerRightDown,
    fork: SplitSquareHorizontal,
    "end of road": Split,
    continue: ArrowRight,
    roundabout: RefreshCw,
    rotary: RefreshCw,
    "roundabout turn": CornerRightDown,
    notification: AlertTriangle,
    "exit roundabout": ArrowRightFromLine,
    "exit rotary": ArrowLeftFromLine,
  };

  // Try to get modifier-specific icon first
  if (modifier && modifierMap[type]?.[modifier]) {
    return modifierMap[type][modifier];
  }

  // Fall back to base icon
  return baseIconMap[type] || ArrowRight;
};

const ManeuverIcon = ({
  type,
  modifier,
}: {
  type: ManeuverType;
  modifier: ManeuverModifier | undefined;
}) => {
  const Icon = getManeuverIcon(type, modifier);
  return <Icon />;
};

export default ManeuverIcon;
