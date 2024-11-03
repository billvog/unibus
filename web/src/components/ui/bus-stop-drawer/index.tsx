import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { X } from "lucide-react";
import React from "react";
import { Drawer } from "vaul";

import { useBusStop } from "@web/components/bus-stop-context";
import BusStopContent from "@web/components/ui/bus-stop-drawer/content";

const BusStop = () => {
  const { selectedStop, setSelectedStopId } = useBusStop();

  const [open, setOpen] = React.useState(false);

  const snapPoints = React.useMemo(() => ["300px", 1], []);
  const [snap, setSnap] = React.useState<number | string | null>(
    snapPoints[0]!,
  );

  React.useEffect(() => {
    setOpen(!!selectedStop);
  }, [selectedStop]);

  const onClose = React.useCallback(() => {
    // Reset drawer state
    setOpen(false);
    setSnap(snapPoints[0]!);

    // Reset selected stop
    setSelectedStopId(null);
  }, [setOpen, setSelectedStopId, setSnap, snapPoints]);

  const onCloseClick = React.useCallback(() => {
    onClose();
  }, [onClose]);

  const onBusVehicleClick = React.useCallback(() => {
    // If drawer is opened at full height, collapse it
    setSnap((s) => (s === 1 ? snapPoints[0]! : s));
  }, [snapPoints]);

  React.useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("drawer-resize", {
        detail: { snap: open ? String(snap) : "0" },
      }),
    );
  }, [snap, open]);

  return (
    <Drawer.Root
      open={open}
      onClose={onClose}
      onOpenChange={(value) => setOpen(value)}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={(value) => setSnap(value)}
      modal={false}
    >
      <Drawer.Overlay className="-z-10" />
      <Drawer.Portal>
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-0 left-0 right-0 mx-auto h-full max-h-[90%] w-full rounded-none bg-white md:max-w-2xl md:rounded-t-2xl"
        >
          <Drawer.Title>
            <VisuallyHidden.Root>Bus Stop</VisuallyHidden.Root>
          </Drawer.Title>
          <div className={"relative flex h-full flex-col"}>
            {/* Resize Handle */}
            <div className="absolute top-2 h-1 w-12 flex-shrink-0 self-center rounded-full bg-gray-200" />
            {/* Close Button */}
            <div className="absolute right-0 top-0 p-4 text-gray-400">
              <X className="cursor-pointer" onClick={onCloseClick} />
            </div>
            {/* Content */}
            <BusStopContent
              onBusVehicleClick={onBusVehicleClick}
              isFullyOpen={snap === 1}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BusStop;
