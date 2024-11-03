import { sql } from "drizzle-orm";
import { geometry, timestamp, uuid } from "drizzle-orm/pg-core";

export const uuidPrimaryKey = (name?: string) =>
  uuid(name ?? "id")
    .primaryKey()
    .notNull()
    .defaultRandom();

export const point = (name: string) =>
  geometry(name, {
    type: "point",
    mode: "xy",
    srid: 4326,
  });

export const timestamps = {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`now()`),
};
