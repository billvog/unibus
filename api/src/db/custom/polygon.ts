import { customType } from "drizzle-orm/pg-core";

export const customGeometry = customType<{ data: string }>({
  dataType() {
    return "geometry(polygon, 4326)";
  },
  toDriver(value: string): string {
    return value;
  },
  fromDriver(value: unknown): string {
    return value as string;
  },
});
