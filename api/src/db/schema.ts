import {
  pgTable,
  serial,
  text,
  integer,
  geometry,
  varchar,
  unique,
} from "drizzle-orm/pg-core";

const point = (name: string) =>
  geometry(name, {
    type: "point",
    mode: "xy",
    srid: 4326,
  });

export const busLine = pgTable("bus_line", {
  id: serial().primaryKey().notNull(),
  code: varchar("code", { length: 2 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  bgColor: varchar("bg_color", { length: 7 }).notNull(),
  textColor: varchar("text_color", { length: 7 }).notNull(),
  borderColor: varchar("border_color", { length: 7 }).notNull(),
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
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  direction: integer().notNull(),
  lineId: integer("line_id")
    .notNull()
    .references(() => busLine.id, { onDelete: "cascade" }),
});

export const busStop = pgTable("bus_stop", {
  id: serial().primaryKey().notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  location: point("location").notNull(),
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
    lineCode: varchar("line_code", { length: 10 })
      .notNull()
      .references(() => busLine.code, {
        onDelete: "cascade",
      }),
    routeCode: varchar("route_code", { length: 10 })
      .notNull()
      .references(() => busRoute.code, { onDelete: "cascade" }),
    stopId: integer("stop_id")
      .notNull()
      .references(() => busStop.id, { onDelete: "cascade" }),
  },
  (t) => ({
    busStopTimeUniqueIndex: unique("bus_stop_time_unique_index").on(
      t.tripId,
      t.stopId,
      t.lineCode,
      t.routeCode
    ),
  })
);

export const busStopToLine = pgTable("bus_stop_to_line", {
  stopId: integer("stop_id")
    .notNull()
    .references(() => busStop.id, { onDelete: "cascade" }),
  lineCode: varchar("line_code", { length: 10 })
    .notNull()
    .references(() => busLine.code, { onDelete: "cascade" }),
});

export const busStopToRoute = pgTable("bus_stop_to_route", {
  stopId: integer("stop_id")
    .notNull()
    .references(() => busStop.id, { onDelete: "cascade" }),
  routeCode: varchar("route_code", { length: 10 })
    .notNull()
    .references(() => busRoute.code, { onDelete: "cascade" }),
});
