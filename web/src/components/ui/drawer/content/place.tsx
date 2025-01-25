import { Trans, useLingui } from "@lingui/react/macro";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";
import React from "react";

import { usePlace } from "@web/components/place-context";
import { Detail } from "@web/components/ui/drawer/content/detail";
import Content from "@web/components/ui/drawer/content/elements";
import DynamicTitle from "@web/components/ui/dynamic-title";
import { useUserLocation } from "@web/components/user-location-context";
import { Events } from "@web/lib/utils/constants";
import { formatFeatureAddress } from "@web/lib/utils/format-feature-address";
import { calculateWalkingDistance } from "@web/lib/utils/walking-distance";
import { type DrawerContentProps } from "@web/types/drawer";
import { type MapFlyToDetail } from "@web/types/events";

const PlaceContent = ({ isFullyOpen }: DrawerContentProps) => {
  const { t } = useLingui();

  const { userLocation } = useUserLocation();
  const { selectedPlace } = usePlace();

  const formattedAddress = React.useMemo(
    () => (selectedPlace ? formatFeatureAddress(selectedPlace) : ""),
    [selectedPlace]
  );

  const walkingDistance = React.useMemo(() => {
    if (!selectedPlace || !userLocation) {
      return null;
    }

    return calculateWalkingDistance(userLocation, {
      longitude: selectedPlace.geometry.coordinates[0]!,
      latitude: selectedPlace.geometry.coordinates[1]!,
    });
  }, [selectedPlace, userLocation]);

  const onPlaceNameClick = React.useCallback(() => {
    if (!selectedPlace) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent<MapFlyToDetail>(Events.MapFlyTo, {
        detail: {
          coordinates: {
            longitude: selectedPlace.geometry.coordinates[0]!,
            latitude: selectedPlace.geometry.coordinates[1]!,
          },
        },
      })
    );
  }, [selectedPlace]);

  if (!selectedPlace) {
    return null;
  }

  return (
    <>
      <Content.Header isFullyOpen={isFullyOpen}>
        <div
          className="flex cursor-pointer flex-col gap-1"
          onClick={onPlaceNameClick}
        >
          <DynamicTitle title={selectedPlace.text} />
          <div className="flex items-center gap-1">
            <MapPin size={16} className="text-red-500" />
            <span className="text-sm">{formattedAddress}</span>
          </div>
        </div>
      </Content.Header>
      <Content.Body isFullyOpen={isFullyOpen}>
        {walkingDistance ? (
          <>
            <div className="flex items-center gap-2 text-center">
              <Detail
                label={t`Distance`}
                text={String(walkingDistance.formattedDistance)}
              />
              <Detail
                label={t`Duration` + " 🚶‍♂️"}
                text={dayjs
                  .duration(walkingDistance.walkingTime, "minutes")
                  .humanize()}
              />
            </div>
            {walkingDistance.distance > 1000 && (
              <div className="text-xs text-gray-500 sm:text-sm">
                <Trans>
                  Hmm.. it's a bit far! <strong>Maybe take a bus?</strong>
                </Trans>{" "}
                🙄
              </div>
            )}
          </>
        ) : (
          <div className="mx-auto flex max-w-lg flex-col gap-3 text-balance text-center">
            <Trans>
              <span className="text-base font-bold sm:text-lg">
                Make sure you have enabled your location!
              </span>
              <p className="text-sm text-gray-500">
                This way we can show you more information about your
                destination.
              </p>
              <p className="text-sm text-gray-700">
                Give us permission through your browser settings!
              </p>
            </Trans>
          </div>
        )}
      </Content.Body>
    </>
  );
};

export default PlaceContent;
