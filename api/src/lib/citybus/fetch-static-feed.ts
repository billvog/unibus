import { db } from "@api/db";
import * as schema from "@api/db/schema";
import { citybusClient } from "@api/lib/axios";
import type {
  BusLine as BusLineType,
  BusStopTrip as BusStopTripType,
  BusStop as BusStopType,
  GetBusLinePointsAPIResponse,
} from "@api/types/citybus";

type Agency = {
  code: number;
  name: string;
  nativeName: string;
  location: { x: number; y: number };
};

const agencies: Agency[] = [
  {
    code: 114,
    name: "Lamia",
    nativeName: "Λαμία",
    location: {
      x: 38.90279,
      y: 22.434722,
    },
  },
  {
    code: 129,
    name: "Veria",
    nativeName: "Βέροια",
    location: {
      x: 40.519362,
      y: 22.205216,
    },
  },
];

export const fetchStaticCitybusFeed = async () => {
  for (const agency of agencies) {
    console.log(`⏳ Creating agency "${agency.name}"...`);

    const newAgency = await db
      .insert(schema.agency)
      .values({
        ...agency,
      })
      .onConflictDoNothing()
      .returning({ id: schema.agency.id });

    let agencyId: string | undefined = undefined;

    if (newAgency.length === 0) {
      const existingAgency = await db.query.agency.findFirst({
        where: ({ code }, { eq }) => eq(code, agency.code),
      });

      if (!existingAgency) {
        console.log("└─ ❌ Agency not found.");
        continue;
      }

      agencyId = existingAgency.id;
      console.log("└─ ✅ Agency found.");
    } else {
      agencyId = newAgency[0].id;
      console.log("└─ ✅ Agency created.");
    }

    console.log("└─ ⏳ Fetching bus lines...");

    // Fetch bus lines and store
    const { data: busLines } = await citybusClient.get<BusLineType[]>(
      `/${agency.code}/lines`
    );

    const busLinesMap = new Map<string, number>(); // lineCode -> lineId
    const busRoutesMap = new Map<string, number>(); // routeCode -> routeId

    for (const line of busLines) {
      console.log("  └─ Processing line:", line.code);

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
        agencyId,
      };

      await db.insert(schema.busLine).values(create).onConflictDoUpdate({
        target: schema.busLine.id,
        set: update,
      });

      busLinesMap.set(line.code, line.id);

      console.log("    └─ ⏳ Fetching bus line points...");

      const lpResponse = await citybusClient.get<GetBusLinePointsAPIResponse>(
        `/${agency.code}/lines/${line.code}/points`
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!lpResponse) {
        console.log("    └─ ❌ No points found.");
        continue;
      }

      const routePoints = lpResponse.data[0].routePoints;
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

        await db.insert(schema.busLinePoint).values(create).onConflictDoUpdate({
          target: schema.busLinePoint.id,
          set: update,
        });
      }

      console.log("    └─ ✅ Bus line points stored");
      console.log("    └─ ⏳ Storing bus line routes...");

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

        await db.insert(schema.busRoute).values(create).onConflictDoUpdate({
          target: schema.busRoute.id,
          set: update,
        });

        busRoutesMap.set(route.code, route.id);
      }

      console.log("    └─ ✅ Bus line routes stored");
    }

    console.log("  └─ ✅ Bus lines processed");
    console.log("└─ ⏳ Fetching bus stops...");

    const { data: busStops } = await citybusClient.get<BusStopType[]>(
      `/${agency.code}/stops`
    );

    const stopsCount = busStops.length;
    let stopsProcessed = 0;

    for (const stop of busStops) {
      stopsProcessed++;
      console.log(`  ├─ Processing stop ${stopsProcessed}/${stopsCount}`);
      console.log(`  └─ ID: ${stop.id}, Code: ${stop.code}`);

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
        agencyId,
      };

      await db.insert(schema.busStop).values(create).onConflictDoUpdate({
        target: schema.busStop.id,
        set: update,
      });

      for (const routeCode of stop.routeCodes) {
        const routeId = busRoutesMap.get(routeCode);
        if (!routeId) {
          console.log(`    └─ ❌ Route not found: ${routeCode}`);
          continue;
        }

        await db
          .insert(schema.busStopToRoute)
          .values({
            stopId: stop.id,
            routeId,
          })
          .onConflictDoNothing();
      }

      for (const lineCode of stop.lineCodes) {
        const lineId = busLinesMap.get(lineCode);
        if (!lineId) {
          console.log(`    └─ ❌ Line not found: ${lineCode}`);
          continue;
        }

        await db
          .insert(schema.busStopToLine)
          .values({
            stopId: stop.id,
            lineId,
          })
          .onConflictDoNothing();
      }

      const stopTripsResponse = await citybusClient.get<BusStopTripType[]>(
        `${agency.code}/trips/stop/${stop.code}`
      );

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!stopTripsResponse) {
        console.log("    └─ ❌ No trips found");
        continue;
      }

      const stopTrips = stopTripsResponse.data;

      for (const trip of stopTrips) {
        const lineId = busLinesMap.get(trip.lineCode);
        const routeId = busRoutesMap.get(trip.routeCode);

        if (!lineId || !routeId) {
          console.log(
            `    └─ ❌ Line or route not found for trip: ${trip.lineCode} ${trip.routeCode}`
          );
          continue;
        }

        const update = {
          tripId: trip.id,
          day: trip.day,
          time: trip.tripTime,
          timeHour: trip.tripTimeHour,
          timeMinute: trip.tripTimeMinute,
          lineId,
          routeId,
          stopId: stop.id,
        };

        const create = {
          ...update,
          agencyId,
        };

        await db
          .insert(schema.busStopTime)
          .values(create)
          .onConflictDoUpdate({
            target: [
              schema.busStopTime.tripId,
              schema.busStopTime.stopId,
              schema.busStopTime.lineId,
              schema.busStopTime.routeId,
            ],
            set: update,
          });
      }

      console.log("    └─ ✅ Bus stop trips stored");
    }
  }

  console.log("🚀 Everything fetched and stored.");
};
