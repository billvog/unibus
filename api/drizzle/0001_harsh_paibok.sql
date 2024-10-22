CREATE TABLE IF NOT EXISTS "bus_line" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(2) NOT NULL,
	"name" varchar(100) NOT NULL,
	"bg_color" varchar(7) NOT NULL,
	"text_color" varchar(7) NOT NULL,
	"border_color" varchar(7) NOT NULL,
	CONSTRAINT "bus_line_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_line_point" (
	"id" serial PRIMARY KEY NOT NULL,
	"sequence" integer NOT NULL,
	"location" geometry(point) NOT NULL,
	"line_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_route" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"direction" integer NOT NULL,
	"line_id" integer NOT NULL,
	CONSTRAINT "bus_route_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"location" geometry(point) NOT NULL,
	CONSTRAINT "bus_stop_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop_to_line" (
	"stop_id" integer NOT NULL,
	"line_code" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop_to_route" (
	"stop_id" integer NOT NULL,
	"route_code" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop_trip" (
	"id" serial PRIMARY KEY NOT NULL,
	"day" integer NOT NULL,
	"time" text NOT NULL,
	"time_hour" integer NOT NULL,
	"time_minute" integer NOT NULL,
	"line_code" varchar(10) NOT NULL,
	"route_code" varchar(10) NOT NULL,
	"stop_id" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_line_point" ADD CONSTRAINT "bus_line_point_line_id_bus_line_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."bus_line"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_route" ADD CONSTRAINT "bus_route_line_id_bus_line_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."bus_line"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_to_line" ADD CONSTRAINT "bus_stop_to_line_stop_id_bus_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."bus_stop"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_to_line" ADD CONSTRAINT "bus_stop_to_line_line_code_bus_line_code_fk" FOREIGN KEY ("line_code") REFERENCES "public"."bus_line"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_to_route" ADD CONSTRAINT "bus_stop_to_route_stop_id_bus_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."bus_stop"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_to_route" ADD CONSTRAINT "bus_stop_to_route_route_code_bus_route_code_fk" FOREIGN KEY ("route_code") REFERENCES "public"."bus_route"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_trip" ADD CONSTRAINT "bus_stop_trip_line_code_bus_line_code_fk" FOREIGN KEY ("line_code") REFERENCES "public"."bus_line"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_trip" ADD CONSTRAINT "bus_stop_trip_route_code_bus_route_code_fk" FOREIGN KEY ("route_code") REFERENCES "public"."bus_route"("code") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_trip" ADD CONSTRAINT "bus_stop_trip_stop_id_bus_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."bus_stop"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
