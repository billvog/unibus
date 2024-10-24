"use client";

import { CircleX } from "lucide-react";
import React from "react";
import { useDebounce } from "use-debounce";

import BusStop from "@web/components/ui/bus-stop";
import { Input } from "@web/components/ui/input";
import { useKeyPress } from "@web/hooks/useKeyPress";
import { cn } from "@web/lib/utils";
import { Events, Shortcuts } from "@web/utils/constants";
import { trpc } from "@web/utils/trpc";

type BusStopsSearchProps = {
  onBusStopClick: (id: number) => void;
};

const BusStopSearch = ({
  onBusStopClick: handleBusStopClick,
}: BusStopsSearchProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [show, setShow] = React.useState(true);
  const [focused, setFocused] = React.useState(false);

  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, 400);

  const searchQuery = trpc.searchBusStop.useQuery(
    { term: debouncedQuery },
    {
      enabled: debouncedQuery.length > 1,
    },
  );

  const busStops = searchQuery.data ?? [];

  // Focus input on "/" key press
  useKeyPress(
    Shortcuts.FocusSearch,
    React.useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, []),
  );

  React.useEffect(() => {
    const eventHandler = (event: Event) => {
      const customEvent = event as CustomEvent<{ snap: string }>;
      setShow(customEvent.detail.snap !== "1");
    };

    window.addEventListener("drawer-resize", eventHandler);

    return () => {
      window.removeEventListener("drawer-resize", eventHandler);
    };
  }, []);

  const closeSearch = React.useCallback(() => {
    setFocused(false);
    setQuery("");
  }, []);

  const onBusStopClick = React.useCallback(
    (id: number) => {
      const busStop = busStops.find((stop) => stop.id === id);
      if (!busStop) return;

      handleBusStopClick(id);
      closeSearch();

      // Capture event
      window.dispatchEvent(
        new CustomEvent(Events.Analytics.BusStopClick, {
          detail: {
            from: {
              name: "BusStopSearch",
              query,
            },
            busStop: {
              id,
              name: busStop.name,
            },
          },
        }),
      );
    },
    [busStops, query, handleBusStopClick, closeSearch],
  );

  return (
    <>
      <div
        className={cn(
          "will-change-opacity absolute bottom-0 left-0 right-0 top-0 bg-black/20 backdrop-blur-sm transition-[opacity] duration-500 ease-out",
          focused ? "z-20 opacity-100" : "-z-10 opacity-0",
        )}
      />
      <div className="absolute left-0 right-0 top-0 z-30 mx-4 my-8 flex flex-col items-center justify-center gap-8">
        <div
          className={cn(
            "relative w-full max-w-lg transition-[transform,opacity] duration-500 ease-out will-change-transform",
            show ? "scale-95 opacity-80" : "scale-90 opacity-0",
            focused && "scale-100 opacity-100",
          )}
        >
          <Input
            ref={inputRef}
            placeholder="Αναζήτηση στάσης... 🔍"
            onFocus={() => setFocused(true)}
            onBlur={() => query.length === 0 && setFocused(false)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {focused && query.length > 0 && (
            <button
              className="absolute bottom-0 right-0 top-0 my-1 mr-2 flex items-center justify-center rounded-full p-1 text-gray-400"
              onClick={() => {
                setQuery("");
                setFocused(false);
              }}
            >
              <CircleX size={18} />
            </button>
          )}
        </div>

        {busStops.length > 0 ? (
          <div
            className={cn(
              "w-full max-w-lg transition-[transform,opacity] duration-500 ease-out will-change-transform",
              focused ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
          >
            <div className="flex flex-col gap-4">
              {busStops.map((busStop) => (
                <BusStop
                  key={busStop.id}
                  onClick={() => onBusStopClick(busStop.id)}
                  busStop={busStop}
                />
              ))}
            </div>
          </div>
        ) : query.length > 0 ? (
          <div>
            <div className="text-center text-lg font-bold text-white">
              Δεν βρέθηκαν αποτελέσματα
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default BusStopSearch;
