"use client";

import { CircleUserRound, CircleX } from "lucide-react";
import React from "react";
import { useDebounce } from "use-debounce";

import BusStop from "@web/components/ui/bus-stop";
import { Input } from "@web/components/ui/input";
import { useKeyPress } from "@web/hooks/useKeyPress";
import { Events, Shortcuts } from "@web/lib/constants";
import { trpc } from "@web/lib/trpc";
import { cn } from "@web/lib/utils";

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

  const openSearch = React.useCallback(() => {
    // Enter focused state
    setFocused(true);
    // Wait for the animation to finish, then focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
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
          "will-change-opacity absolute bottom-0 left-0 right-0 top-0 bg-black/20 backdrop-blur-sm transition-[opacity] duration-300 ease-out",
          focused ? "z-20 opacity-100" : "-z-10 opacity-0",
        )}
      />
      <div className="absolute left-0 right-0 top-0 z-30 mx-4 my-8 flex flex-col items-center justify-center gap-8">
        <div
          className={cn(
            "flex w-full max-w-lg items-center gap-4 rounded-xl bg-white ring-1 ring-gray-200 transition-[transform,opacity,gap] duration-300 ease-out will-change-transform",
            show ? "scale-95 opacity-95" : "scale-90 opacity-0",
            focused && "scale-100 gap-0 ring-0",
          )}
        >
          <div className="relative w-full rounded-lg p-1">
            {/* To fight with the animation glitch on mobile devices. */}
            {!focused && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0 z-20 cursor-text"
                onClick={openSearch}
              />
            )}
            {/* Search Input */}
            <Input
              ref={inputRef}
              placeholder="Αναζήτηση στάσης... 🔍"
              onFocus={() => setFocused(true)}
              onBlur={() => query.length === 0 && setFocused(false)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* Search Close Button */}
            {focused && query.length > 0 && (
              <button
                className="absolute bottom-0 right-0 top-0 my-1 mr-4 flex items-center justify-center rounded-full p-1 text-gray-400"
                onClick={() => {
                  setQuery("");
                  setFocused(false);
                }}
              >
                <CircleX size={18} />
              </button>
            )}
          </div>

          {/* User Account */}
          <div
            className={cn(
              "scale-100 cursor-pointer border-l-2 border-gray-200 opacity-100",
              focused ? "opacity-0" : "p-2.5",
            )}
          >
            <CircleUserRound size={focused ? 0 : 24} />
          </div>
        </div>

        {busStops.length > 0 ? (
          <div
            className={cn(
              "w-full max-w-lg transition-[transform,opacity] duration-300 ease-out will-change-transform",
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
