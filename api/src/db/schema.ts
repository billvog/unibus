import {
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

import { point, timestamps, uuidPrimaryKey } from "@api/db/fields";

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Authentication Models                                                   │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const user = pgTable("user", {
  id: uuidPrimaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  refreshTokenVersion: integer("refresh_token_version").default(1).notNull(),
  ...timestamps,
});

export const userAccount = pgTable(
  "user_account",
  {
    id: uuidPrimaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerId: varchar("provider_id", { length: 100 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 100,
    })
      .notNull()
      .unique(),
    ...timestamps,
  },
  (t) => ({
    userAccountUniqueIndex: unique("user_account_unique_index").on(
      t.userId,
      t.providerId,
      t.providerAccountId
    ),
  })
);

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Bus Models                                                              │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const agency = pgTable("agency", {
  id: uuidPrimaryKey(),
  code: integer("code").notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  nativeName: varchar("native_name", { length: 100 }).notNull(),
  location: point("location"),
  ...timestamps,
});

export const busLine = pgTable("bus_line", {
  id: serial().primaryKey().notNull(),
  code: varchar("code", { length: 2 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  bgColor: varchar("bg_color", { length: 7 }).notNull(),
  textColor: varchar("text_color", { length: 7 }).notNull(),
  borderColor: varchar("border_color", { length: 7 }).notNull(),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agency.id, {
      onDelete: "cascade",
    }),
});

export const busLinePoint = pgTable("bus_line_point", {
  id: serial().primaryKey().notNull(),
  sequence: integer().notNull(),
  location: point("location").notNull(),
  lineId: integer("line_id")
    .notNull()
    .references(() => busLine.id, { onDelete: "cascade" }),
});

export const busRoute = pgTable("bus_route", {
  id: serial().primaryKey().notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  direction: integer().notNull(),
  lineId: integer("line_id")
    .notNull()
    .references(() => busLine.id, { onDelete: "cascade" }),
});

export const busStop = pgTable("bus_stop", {
  id: serial().primaryKey().notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  location: point("location").notNull(),
  agencyId: uuid("agency_id")
    .notNull()
    .references(() => agency.id, {
      onDelete: "cascade",
    }),
});

export const busStopTime = pgTable(
  "bus_stop_time",
  {
    id: serial().primaryKey().notNull(),
    tripId: integer("trip_id").notNull(),
    day: integer().notNull(),
    time: text().notNull(),
    timeHour: integer("time_hour").notNull(),
    timeMinute: integer("time_minute").notNull(),
    agencyId: uuid("agency_id")
      .notNull()
      .references(() => agency.id, {
        onDelete: "cascade",
      }),
    lineId: integer("line_id")
      .notNull()
      .references(() => busLine.id, {
        onDelete: "cascade",
      }),
    routeId: integer("route_id")
      .notNull()
      .references(() => busRoute.id, { onDelete: "cascade" }),
    stopId: integer("stop_id")
      .notNull()
      .references(() => busStop.id, { onDelete: "cascade" }),
  },
  (t) => ({
    busStopTimeUniqueIndex: unique("bus_stop_time_unique_index").on(
      t.tripId,
      t.stopId,
      t.lineId,
      t.routeId
    ),
  })
);

export const busStopToLine = pgTable(
  "bus_stop_to_line",
  {
    stopId: integer("stop_id")
      .notNull()
      .references(() => busStop.id, { onDelete: "cascade" }),
    lineId: integer("line_id")
      .notNull()
      .references(() => busLine.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.stopId, t.lineId] }),
  })
);

export const busStopToRoute = pgTable(
  "bus_stop_to_route",
  {
    stopId: integer("stop_id")
      .notNull()
      .references(() => busStop.id, { onDelete: "cascade" }),
    routeId: integer("route_id")
      .notNull()
      .references(() => busRoute.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.stopId, t.routeId] }),
  })
);

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ User <-> Bus Models                                                     │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const userFavoriteBusStop = pgTable(
  "user_favorite_bus_stop",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stopId: integer("stop_id")
      .notNull()
      .references(() => busStop.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.stopId] }),
  })
);

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ User Relations                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const userRelations = relations(user, ({ many }) => ({
  userAccounts: many(userAccount),
  favoriteBusStops: many(userFavoriteBusStop),
}));

export const userAccountRelations = relations(userAccount, ({ one }) => ({
  user: one(user, {
    fields: [userAccount.userId],
    references: [user.id],
  }),
}));

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Bus Relations                                                           │
  └─────────────────────────────────────────────────────────────────────────┘
 */

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
  busLine: one(busLine, {
    fields: [busStopTime.lineId],
    references: [busLine.id],
  }),
  busRoute: one(busRoute, {
    fields: [busStopTime.routeId],
    references: [busRoute.id],
  }),
  busStop: one(busStop, {
    fields: [busStopTime.stopId],
    references: [busStop.id],
  }),
}));

export const busStopRelations = relations(busStop, ({ many }) => ({
  busStopTimes: many(busStopTime),
  busRoutes: many(busRoute),
  busLines: many(busStopToLine),
}));

export const busStopToLineRelations = relations(busStopToLine, ({ one }) => ({
  busStop: one(busStop, {
    fields: [busStopToLine.stopId],
    references: [busStop.id],
  }),
  busLine: one(busLine, {
    fields: [busStopToLine.lineId],
    references: [busLine.id],
  }),
}));

export const busStopToRouteRelations = relations(busStopToRoute, ({ one }) => ({
  busStop: one(busStop, {
    fields: [busStopToRoute.stopId],
    references: [busStop.id],
  }),
  busRoute: one(busRoute, {
    fields: [busStopToRoute.routeId],
    references: [busRoute.id],
  }),
}));
