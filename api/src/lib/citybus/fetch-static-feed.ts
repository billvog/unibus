import { db } from "@api/db";
import {
  busLine,
  busLinePoint,
  busRoute,
  busStop,
  busStopToLine,
  busStopToRoute,
  busStopTime,
} from "@api/db/schema";
import { citybusClient } from "@api/lib/axios";
import type {
  BusLine as BusLineType,
  BusStopTrip as BusStopTripType,
  BusStop as BusStopType,
  GetBusLinePointsAPIResponse,
} from "@api/types/citybus";

export const fetchStaticCitybusFeed = async () => {
  console.log("⏳ Fetching bus lines...");

  // Fetch bus lines and store
  const { data: busLines } = await citybusClient.get<BusLineType[]>("/lines");
  for (const line of busLines) {
    console.log("-- Line:", line.code);

    const update = {
      name: line.name,
      bgColor: line.color.toUpperCase(),
      borderColor: line.borderColor.toUpperCase(),
      textColor: line.textColor.toUpperCase(),
    };

    const create = {
      ...update,
      id: line.id,
      code: line.code,
    };

    await db.insert(busLine).values(create).onConflictDoUpdate({
      target: busLine.id,
      set: update,
    });

    console.log("---- ⏳ Fetching bus line points...");

    const { data: pointResponse } =
      await citybusClient.get<GetBusLinePointsAPIResponse>(
        `/lines/${line.code}/points`
      );

    const routePoints = pointResponse[0].routePoints;
    for (const point of routePoints) {
      const update = {
        location: {
          x: Number(point.longitude),
          y: Number(point.latitude),
        },
        sequence: point.sequence,
      };

      const create = {
        ...update,
        id: point.id,
        lineId: line.id,
      };

      await db.insert(busLinePoint).values(create).onConflictDoUpdate({
        target: busLinePoint.id,
        set: update,
      });
    }

    console.log("---- ✅ Bus line points fetched and stored.");
    console.log("---- ⏳ Storing bus line routes...");

    for (const route of line.routes) {
      const update = {
        direction: route.direction,
        name: route.name,
      };

      const create = {
        ...update,
        id: route.id,
        lineId: line.id,
        code: route.code,
      };

      await db.insert(busRoute).values(create).onConflictDoUpdate({
        target: busRoute.id,
        set: update,
      });
    }

    console.log("---- ✅ Bus line routes stored.");
  }

  console.log("✅ Bus lines fetched and stored");
  console.log("⏳ Fetching bus stops...");

  // Fetch bus stops and store
  const { data: busStops } = await citybusClient.get<BusStopType[]>("/stops");

  const stopsCount = busStops.length;
  let stopsProcessed = 0;

  for (const stop of busStops) {
    console.log("-- Stop:", `ID: ${stop.id} <> Code: ${stop.code}...`);

    stopsProcessed++;

    const update = {
      name: stop.name,
      location: {
        x: stop.longitude,
        y: stop.latitude,
      },
    };

    const create = {
      ...update,
      id: stop.id,
      code: stop.code,
    };

    await db.insert(busStop).values(create).onConflictDoUpdate({
      target: busStop.id,
      set: update,
    });

    for (const routeCode of stop.routeCodes) {
      await db.insert(busStopToRoute).values({
        stopId: stop.id,
        routeCode,
      });
    }

    for (const lineCode of stop.lineCodes) {
      await db.insert(busStopToLine).values({
        stopId: stop.id,
        lineCode,
      });
    }

    const stopTripsResponse = await citybusClient.get<BusStopTripType[]>(
      `/trips/stop/${stop.code}`
    );

    // When response is 404, this is undefined.
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!stopTripsResponse) {
      console.log("-- ❌ No trips found.");
      continue;
    }

    const stopTrips = stopTripsResponse.data;

    for (const trip of stopTrips) {
      const update = {
        tripId: trip.id,
        day: trip.day,
        time: trip.tripTime,
        timeHour: trip.tripTimeHour,
        timeMinute: trip.tripTimeMinute,
        lineCode: trip.lineCode,
        routeCode: trip.routeCode,
        stopId: stop.id,
      };

      const create = {
        ...update,
      };

      await db
        .insert(busStopTime)
        .values(create)
        .onConflictDoUpdate({
          target: [
            busStopTime.tripId,
            busStopTime.stopId,
            busStopTime.lineCode,
            busStopTime.routeCode,
          ],
          set: update,
        });
    }

    console.log(
      `-- ✅ Bus stop trips fetched and stored. (${stopsProcessed}/${stopsCount})`
    );
  }

  console.log("🚀 Everything fetched and stored.");
};
