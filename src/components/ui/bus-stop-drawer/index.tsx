import { useBusStop } from "@/components/bus-stop-context";
import BusStopContent from "@/components/ui/bus-stop-drawer/content";
import { X } from "lucide-react";
import React from "react";
import { Drawer } from "vaul";

const BusStop = () => {
  const { selectedStop, setSelectedStop } = useBusStop();

  const [open, setOpen] = React.useState(false);

  const snapPoints = ["300px", 1];
  const [snap, setSnap] = React.useState<number | string | null>(
    snapPoints[0]!,
  );

  React.useEffect(() => {
    setOpen(!!selectedStop);
  }, [selectedStop]);

  const onOpenChange = React.useCallback(
    (value: boolean) => {
      if (!value) {
        setSelectedStop(null);
      }

      setOpen(value);
    },
    [setOpen, setSelectedStop],
  );

  const onClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onCloseClick = React.useCallback(() => {
    setSelectedStop(null);
    onClose();
  }, [onClose, setSelectedStop]);

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
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
    >
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Portal>
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed bottom-0 left-0 right-0 mx-[-1px] h-full max-h-[97%] bg-white"
        >
          <div className="relative flex flex-col gap-4 overflow-y-auto p-10">
            {/* Resize Handle */}
            <div className="absolute top-2 h-1 w-12 flex-shrink-0 self-center rounded-full bg-gray-200" />
            {/* Close Buttons */}
            <div className="absolute right-0 top-0 p-4 text-gray-400">
              <X className="cursor-pointer" onClick={onCloseClick} />
            </div>
            {/* Content */}
            <BusStopContent />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default BusStop;
