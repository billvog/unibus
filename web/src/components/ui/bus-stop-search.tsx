"use client";

import BusStop from "@/components/ui/bus-stop";
import { Input } from "@/components/ui/input";
import { useKeyPress } from "@/hooks/useKeyPress";
import { cn } from "@/lib/utils";
import { BusStop as BusStopType } from "@/types/citybus";
import { Shortcuts } from "@/utils/constants";
import { CircleX } from "lucide-react";
import React from "react";
import { search } from "ss-search";

type BusStopsSearchProps = {
  busStops: BusStopType[];
  onBusStopClick: (id: number) => void;
};

const BusStopSearch = ({
  busStops,
  onBusStopClick: handleBusStopClick,
}: BusStopsSearchProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [show, setShow] = React.useState(true);
  const [focused, setFocused] = React.useState(false);

  const [query, setQuery] = React.useState("");

  const results = React.useMemo(() => {
    if (busStops.length === 0 || query.length === 0) return [];

    return search(busStops, ["code", "name"], query, {
      withScore: true,
    })
      .sort((a, b) => b.score - a.score)
      .filter((result) => result.score > 0)
      .slice(0, 5);
  }, [busStops, query]);

  // Focus input on "/" key press
  useKeyPress(
    Shortcuts.FocusSearch,
    React.useCallback(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [inputRef.current]),
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
      handleBusStopClick(id);
      closeSearch();
    },
    [handleBusStopClick, closeSearch],
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

        {results.length > 0 ? (
          <div
            className={cn(
              "w-full max-w-lg transition-[transform,opacity] duration-500 ease-out will-change-transform",
              focused ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
          >
            <div className="flex flex-col gap-4">
              {results.map(({ element: busStop }) => (
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
