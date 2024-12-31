import { InferSelectModel } from "drizzle-orm";

import {
  busStop,
  busLine,
  busLinePoint,
  busRoute,
  busStopTime,
  busStopToLine,
  busStopToRoute,
  user,
  userAccount,
  agency,
} from "@api/db/schema";

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ User Model Types                                                        │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export type DbUser = InferSelectModel<typeof user>;

export type DbUserAccount = InferSelectModel<typeof userAccount> & {
  user: DbUser;
};

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Bus Model Types                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export type DbAgency = Omit<
  InferSelectModel<typeof agency>,
  "polygon" | "createdAt" | "updatedAt"
>;

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

// When bus stops are fetched in search
export type DbSearchedBusStop = InferSelectModel<typeof busStop> & {
  busLines: DbBusStopToLine[];
  agency: DbAgency;
  rank: number;
};
