import { InferSelectModel } from "drizzle-orm";

import {
  busStop,
  busLine,
  busLinePoint,
  busRoute,
  busStopTime,
  busStopToLine,
  busStopToRoute,
} from "@api/db/schema";

export type DbBusLine = InferSelectModel<typeof busLine>;

export type DbBusLinePoint = Omit<
  InferSelectModel<typeof busLinePoint>,
  "lineId"
>;

export type DbBusRoute = InferSelectModel<typeof busRoute>;

// When bus stops are fetched in bulk
export type DbMassBusStop = Pick<
  InferSelectModel<typeof busStop>,
  "id" | "location"
>;

export type DbBusStop = InferSelectModel<typeof busStop> & {
  busLines: DbBusStopToLine[];
};

export type DbBusStopToLine = InferSelectModel<typeof busStopToLine> & {
  busLine: DbBusLine;
};

export type DbBusStopToRoute = InferSelectModel<typeof busStopToRoute> & {
  busRoute: DbBusRoute;
};

export type DbBusStopTime = InferSelectModel<typeof busStopTime> & {
  busRoute: DbBusRoute;
  busLine: DbBusLine;
};
