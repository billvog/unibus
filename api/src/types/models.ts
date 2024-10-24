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

export type BusLine = InferSelectModel<typeof busLine>;

export type BusLinePoint = InferSelectModel<typeof busLinePoint>;

export type BusRoute = InferSelectModel<typeof busRoute>;

export type BusStop = InferSelectModel<typeof busStop> & {
  busLines: BusStopToLine[];
};

export type BusStopToLine = InferSelectModel<typeof busStopToLine> & {
  busLine: BusLine;
};

export type BusStopToRoute = InferSelectModel<typeof busStopToRoute> & {
  busRoute: BusRoute;
};

export type BusStopTime = InferSelectModel<typeof busStopTime> & {
  busRoute: BusRoute;
  busLine: BusLine;
};
