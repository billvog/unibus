import type {
  BusLine as BusLineType,
  BusStopTrip as BusStopTripType,
  BusStop as BusStopType,
  GetBusLinePointsAPIResponse,
} from "@api/types/citybus";
import { citybusClient } from "@api/utils/axios";
import { db } from "@api/utils/prisma";

export const fetchStaticCitybusFeed = async () => {
  console.log("⏳ Fetching bus lines...");

  // Fetch bus lines and store
  const { data: busLines } = await citybusClient.get<BusLineType[]>("/lines");
  for (const busLine of busLines) {
    console.log("-- Line:", busLine.code);

    const update = {
      name: busLine.name,
      borderColor: busLine.borderColor,
      color: busLine.color,
      textColor: busLine.textColor,
    };

    const create = {
      ...update,
      id: busLine.id,
      code: busLine.code,
    };

    await db.busLine.upsert({
      where: { id: busLine.id },
      update,
      create,
    });

    console.log("---- ⏳ Fetching bus line points...");

    const { data: pointResponse } =
      await citybusClient.get<GetBusLinePointsAPIResponse>(
        `/lines/${busLine.code}/points`
      );

    const routePoints = pointResponse[0].routePoints;
    for (const point of routePoints) {
      const update = {
        latitude: point.latitude,
        longitude: point.longitude,
        sequence: point.sequence,
      };

      const create = {
        ...update,
        id: point.id,
        lineId: busLine.id,
      };

      await db.busLinePoint.upsert({
        where: { id: point.id },
        update,
        create,
      });
    }

    console.log("---- ✅ Bus line points fetched and stored.");
    console.log("---- ⏳ Storing bus line routes...");

    for (const route of busLine.routes) {
      const update = {
        direction: route.direction,
        name: route.name,
      };

      const create = {
        ...update,
        id: route.id,
        lineId: busLine.id,
        code: route.code,
      };

      await db.busRoute.upsert({
        where: { id: route.id },
        update,
        create,
      });
    }

    console.log("---- ✅ Bus line routes stored.");
  }

  console.log("✅ Bus lines fetched and stored");
  console.log("⏳ Fetching bus stops...");

  // Fetch bus stops and store
  const { data: busStops } = await citybusClient.get<BusStopType[]>("/stops");
  for (const stop of busStops) {
    console.log("-- Stop:", `${stop.code}...`);

    const update = {
      name: stop.name,
      latitude: Number(stop.latitude),
      longitude: Number(stop.longitude),
      distance: stop.distance,
    };

    const create = {
      ...update,
      id: stop.id,
      code: stop.code,
      lineCodes: stop.lineCodes,
      routeCodes: stop.routeCodes,
    };

    await db.busStop.upsert({
      where: { id: stop.id },
      update,
      create,
    });

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
        day: trip.day,
        time: trip.tripTime,
        timeHour: trip.tripTimeHour,
        timeMinute: trip.tripTimeMinute,
        lineCode: trip.lineCode,
        lineColor: trip.lineColor,
        lineName: trip.lineName,
        lineTextColor: trip.lineTextColor,
        routeCode: trip.routeCode,
        routeName: trip.routeName,
      };

      const create = {
        ...update,
        id: trip.id,
        stopId: stop.id,
      };

      await db.busStopTrip.upsert({
        where: { id: trip.id },
        update,
        create,
      });
    }

    console.log("-- ✅ Bus stop trips fetched and stored.");
  }

  console.log("✅ Bus stops fetched and stored.");

  console.log("🚀 Everything fetched and stored.");
};
