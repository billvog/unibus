"use client";

import { Trans, useLingui } from "@lingui/react/macro";
import { type Coordinates } from "@mapbox/mapbox-sdk/lib/classes/mapi-request";
import { type GeocodeFeature } from "@mapbox/mapbox-sdk/services/geocoding";
import * as Sentry from "@sentry/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { CircleEllipsis, CircleX } from "lucide-react";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";

import { searchAtom } from "@web/atoms/search";
import { usePlace } from "@web/components/place-context";
import BusStop from "@web/components/ui/bus-stop";
import { Input } from "@web/components/ui/input";
import Place from "@web/components/ui/place";
import MenuDropdown from "@web/components/ui/search/menu-dropdown";
import { Spinner } from "@web/components/ui/spinner";
import { useUserLocation } from "@web/components/user-location-context";
import { useInitialValue } from "@web/hooks/use-initial-value";
import { useKeyPress } from "@web/hooks/use-key-press";
import { mbxGeocodingClient } from "@web/lib/mapbox";
import { trpc } from "@web/lib/trpc";
import { Events, Shortcuts } from "@web/lib/utils/constants";
import { generateRandomId } from "@web/lib/utils/random-id";
import { searchAndRankResults } from "@web/lib/utils/search-results";
import { cn } from "@web/lib/utils/tailwind";
import { type MapFlyToDetail } from "@web/types/events";

// Minimum query length to start searching
const QUERY_THRESHOLD = 3;

// Debounce time for search query
const QUERY_DEBOUNCE = 400;

type SearchProps = {
  onBusStopClick: (id: number) => void;
};

const Search = ({ onBusStopClick: handleBusStopClick }: SearchProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [searchSessionToken] = useState(() => generateRandomId());

  const { t, i18n } = useLingui();

  const { userLocation } = useUserLocation();
  const { setSelectedPlace } = usePlace();

  const initialUserLocation = useInitialValue(userLocation);

  const [show, setShow] = React.useState(true);

  const [searchState, setSearchState] = useAtom(searchAtom);
  const open = React.useMemo(() => searchState.open, [searchState.open]);

  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounce(query, QUERY_DEBOUNCE);

  const [searchFeatures, setSearchFeatures] = React.useState<GeocodeFeature[]>(
    [],
  );

  const searchQuery = trpc.searchBusStop.useQuery(
    { term: debouncedQuery },
    {
      enabled: debouncedQuery.length > QUERY_THRESHOLD,
    },
  );

  const busStops = React.useMemo(
    () => searchQuery.data ?? [],
    [searchQuery.data],
  );

  const results = React.useMemo(() => {
    if (
      debouncedQuery.length < QUERY_THRESHOLD ||
      (!searchFeatures.length && !busStops.length)
    ) {
      return [];
    }

    return searchAndRankResults(debouncedQuery, searchFeatures, busStops);
  }, [debouncedQuery, searchFeatures, busStops]);

  const hasResults = React.useMemo(() => results.length > 0, [results.length]);

  const searchPlaces = useMutation({
    mutationFn: async (location: Coordinates | undefined) => {
      const response = await mbxGeocodingClient
        .forwardGeocode({
          query: debouncedQuery,
          mode: "mapbox.places",
          countries: ["GR"],
          language: [i18n.locale],
          proximity: location ?? "ip",
          session_token: searchSessionToken,
          limit: 5,
        })
        .send();

      return response.body;
    },
    onSuccess: (data) => {
      setSearchFeatures(data.features);
    },
    onError: (error) => {
      // Send error to Sentry
      Sentry.captureException(error);
    },
  });

  const isLoading = React.useMemo(
    () => searchQuery.isLoading || searchPlaces.isPending,
    [searchQuery.isLoading, searchPlaces.isPending],
  );

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

  React.useEffect(() => {
    if (debouncedQuery.length < QUERY_THRESHOLD) return;

    const location: Coordinates | undefined = initialUserLocation
      ? [initialUserLocation.longitude, initialUserLocation.latitude]
      : undefined;

    searchPlaces.mutate(location);
  }, [initialUserLocation, debouncedQuery, i18n.locale]);

  const setOpen = React.useCallback(
    (value: boolean) => {
      setSearchState((prev) => ({ ...prev, open: value }));
    },
    [setSearchState],
  );

  const openSearch = React.useCallback(() => {
    // Enter opened state
    setOpen(true);

    // Wait for the animation to finish, then focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  }, [setOpen]);

  const closeSearch = React.useCallback(() => {
    setSearchFeatures([]);
    setOpen(false);
    setQuery("");
  }, [setOpen]);

  const onPlaceClick = React.useCallback(
    (id: string) => {
      const feature = searchFeatures.find((feature) => feature.id === id);

      if (!feature || feature.geometry.coordinates.length !== 2) return;

      closeSearch();

      setSelectedPlace(feature);

      // Emit event to fly map to place
      window.dispatchEvent(
        new CustomEvent<MapFlyToDetail>(Events.MapFlyTo, {
          detail: {
            coordinates: {
              longitude: feature.geometry.coordinates[0]!,
              latitude: feature.geometry.coordinates[1]!,
            },
          },
        }),
      );
    },
    [searchFeatures],
  );

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
          "absolute bottom-0 left-0 right-0 top-0 bg-black/20 backdrop-blur-sm transition-[opacity] duration-300 ease-out will-change-[opacity]",
          open ? "z-20 opacity-100" : "-z-10 opacity-0",
        )}
      />
      <div className="absolute left-0 right-0 top-0 z-30 mx-4 my-8 flex flex-col items-center justify-center gap-8">
        <div
          className={cn(
            "flex w-full max-w-lg items-center gap-4 rounded-xl bg-white ring-1 ring-gray-200 transition-[transform,opacity,gap] duration-300 ease-out will-change-transform",
            show ? "scale-95 opacity-95" : "scale-90 opacity-0",
            open && "scale-100 gap-0 ring-0",
          )}
        >
          <div className="relative w-full rounded-lg p-1">
            {/* To fight with the animation glitch on mobile devices. */}
            {!open && (
              <div
                className="absolute bottom-0 left-0 right-0 top-0 z-20 cursor-text"
                onClick={openSearch}
              />
            )}
            {/* Search Input */}
            <Input
              ref={inputRef}
              placeholder={t`Where to?` + "  🔍"}
              onFocus={() => setOpen(true)}
              onBlur={() => query.length === 0 && setOpen(false)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {/* Search Close Button */}
            {open && query.length > 0 && (
              <button
                className="absolute bottom-0 right-0 top-0 my-1 mr-3 flex items-center justify-center rounded-full p-1 text-gray-400"
                onClick={() => closeSearch()}
              >
                <CircleX size={18} />
              </button>
            )}
          </div>

          {/* User Account */}
          <MenuDropdown>
            <div
              className={cn(
                "scale-100 border-l-2 border-gray-200 transition-opacity duration-300 ease-out will-change-[opacity]",
                open ? "opacity-0" : "p-2.5 opacity-100",
              )}
            >
              <CircleEllipsis color="#808080" size={open ? 0 : 24} />
            </div>
          </MenuDropdown>
        </div>

        {isLoading ? (
          <div className="py-6">
            <Spinner className="text-white" />
          </div>
        ) : hasResults ? (
          <div
            className={cn(
              "w-full max-w-lg transition-[transform,opacity] duration-300 ease-out will-change-transform",
              open ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
          >
            <div className="flex flex-col gap-4">
              {results.map((result) =>
                result.type === "place" ? (
                  <Place
                    key={result.item.id}
                    feature={result.item}
                    onClick={() => onPlaceClick(result.item.id)}
                  />
                ) : result.type === "busStop" ? (
                  <BusStop
                    key={result.item.id}
                    busStop={result.item}
                    onClick={() => onBusStopClick(result.item.id)}
                  />
                ) : null,
              )}
            </div>
          </div>
        ) : query.length > 0 ? (
          <div>
            <div className="text-center text-lg font-bold text-white">
              <Trans>No results found</Trans>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Search;
