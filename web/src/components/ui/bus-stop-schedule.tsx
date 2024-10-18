"use client";

import BusStopTrip from "@/components/ui/bus-stop-trip";
import { type BusStopTrip as BusStopTripType } from "@/types/citybus";
import React from "react";

type BusStopScheduleProps = {
  busStopTrips: BusStopTripType[];
};

const BusStopSchedule = ({ busStopTrips }: BusStopScheduleProps) => {
  const groupedTrips = React.useMemo(() => {
    const grouped = new Map<number, BusStopTripType[]>();
    busStopTrips.forEach((trip) => {
      if (grouped.has(trip.tripTimeHour)) {
        grouped.get(trip.tripTimeHour)?.push(trip);
        return;
      }

      grouped.set(trip.tripTimeHour, [trip]);
    });
    return grouped;
  }, [busStopTrips]);

  React.useEffect(() => {
    const currentHour = new Date().getHours();
    document.getElementById(`bus-stop-trip-${currentHour}`)?.scrollIntoView();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {Array.from(groupedTrips).map(([hour, trips]) => (
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
      ))}
    </div>
  );
};

export default BusStopSchedule;
