import { InferSelectModel } from "drizzle-orm";

import {
  busStop,
  busLine,
  busLinePoint,
  busRoute,
  busStopTrip,
} from "@api/db/schema";

export type BusStop = InferSelectModel<typeof busStop>;
export type BusLine = InferSelectModel<typeof busLine>;
export type BusLinePoint = InferSelectModel<typeof busLinePoint>;
export type BusRoute = InferSelectModel<typeof busRoute>;
export type BusStopTrip = InferSelectModel<typeof busStopTrip>;
