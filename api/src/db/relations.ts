import { relations } from "drizzle-orm/relations";

import {
  busLine,
  busLinePoint,
  busRoute,
  busStop,
  busStopTime,
} from "@api/db/schema";

export const busLinePointRelations = relations(busLinePoint, ({ one }) => ({
  busLine: one(busLine, {
    fields: [busLinePoint.lineId],
    references: [busLine.id],
  }),
}));

export const busLineRelations = relations(busLine, ({ many }) => ({
  busLinePoints: many(busLinePoint),
  busRoutes: many(busRoute),
  busStops: many(busStop),
}));

export const busRouteRelations = relations(busRoute, ({ one, many }) => ({
  busLine: one(busLine, {
    fields: [busRoute.lineId],
    references: [busLine.id],
  }),
  busStops: many(busStop),
}));

export const busStopTimeRelations = relations(busStopTime, ({ one }) => ({
  busStop: one(busStop, {
    fields: [busStopTime.stopId],
    references: [busStop.id],
  }),
}));

export const busStopRelations = relations(busStop, ({ many }) => ({
  busStopTimes: many(busStopTime),
  busRoutes: many(busRoute),
  busLines: many(busLine),
}));
