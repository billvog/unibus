"use client";

import { type BusStopTrip as BusStopTripType } from "@api/types/models";
import React from "react";

import BusStopTrip from "@web/components/ui/bus-stop-trip";
import { Spinner } from "@web/components/ui/spinner";
import { cn } from "@web/lib/utils";
import { Days } from "@web/utils/constants";

type BusStopScheduleProps = {
  busStopTrips: BusStopTripType[];
  selectedDay: number;
  onDayClick: (day: number) => void;
  isLoading: boolean;
};

const BusStopSchedule = ({
  busStopTrips,
  selectedDay,
  onDayClick,
  isLoading,
}: BusStopScheduleProps) => {
  const groupedTrips = React.useMemo(() => {
    const grouped = new Map<number, BusStopTripType[]>();
    busStopTrips.forEach((trip) => {
      if (grouped.has(trip.timeHour)) {
        grouped.get(trip.timeHour)?.push(trip);
        return;
      }

      grouped.set(trip.timeHour, [trip]);
    });
    return grouped;
  }, [busStopTrips]);

  React.useEffect(() => {
    const currentHour = new Date().getHours();
    document.getElementById(`bus-stop-trip-${currentHour}`)?.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Day selector */}
      <div className="no-scrollbar flex items-center justify-evenly gap-2 overflow-x-auto">
        {Days.map((day, index) => (
          <div
            key={day}
            className={cn(
              "cursor-pointer rounded-lg border-2 border-gray-200 px-2 py-0.5 text-sm",
              selectedDay === index && "bg-gray-200",
              isLoading && "cursor-not-allowed opacity-40",
            )}
            onClick={() => {
              if (!isLoading) {
                onDayClick(index);
              }
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Bus trips */}
      {isLoading ? (
        <div className="flex flex-1 justify-center py-5">
          <Spinner className="text-gray-500" />
        </div>
      ) : groupedTrips.size > 0 ? (
        Array.from(groupedTrips).map(([hour, trips]) => (
          <div
            key={hour}
            id={`bus-stop-trip-${hour}`}
            className="flex flex-col gap-1"
          >
            <h3 className="text-2xl font-black leading-relaxed after:ml-0.5 after:align-super after:text-xs after:content-['00']">
              {hour}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {trips.map((trip) => (
                <BusStopTrip key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>Κάτι πήγε στραβά! Προσπαθήστε ξανά 😢</div>
      )}
    </div>
  );
};

export default BusStopSchedule;
