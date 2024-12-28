CREATE TABLE IF NOT EXISTS "agency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"native_name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "agency_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_line" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(2) NOT NULL,
	"name" varchar(100) NOT NULL,
	"bg_color" varchar(7) NOT NULL,
	"text_color" varchar(7) NOT NULL,
	"border_color" varchar(7) NOT NULL,
	"agency_id" uuid NOT NULL
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
	"code" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"direction" integer NOT NULL,
	"line_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(10) NOT NULL,
	"name" varchar(100) NOT NULL,
	"location" geometry(point) NOT NULL,
	"agency_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop_time" (
	"id" serial PRIMARY KEY NOT NULL,
	"trip_id" integer NOT NULL,
	"day" integer NOT NULL,
	"time" text NOT NULL,
	"time_hour" integer NOT NULL,
	"time_minute" integer NOT NULL,
	"agency_id" uuid NOT NULL,
	"line_id" integer NOT NULL,
	"route_id" integer NOT NULL,
	"stop_id" integer NOT NULL,
	CONSTRAINT "bus_stop_time_unique_index" UNIQUE("trip_id","stop_id","line_id","route_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop_to_line" (
	"stop_id" integer NOT NULL,
	"line_id" integer NOT NULL,
	CONSTRAINT "bus_stop_to_line_stop_id_line_id_pk" PRIMARY KEY("stop_id","line_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bus_stop_to_route" (
	"stop_id" integer NOT NULL,
	"route_id" integer NOT NULL,
	CONSTRAINT "bus_stop_to_route_stop_id_route_id_pk" PRIMARY KEY("stop_id","route_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"refresh_token_version" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" varchar(100) NOT NULL,
	"provider_account_id" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_account_provider_account_id_unique" UNIQUE("provider_account_id"),
	CONSTRAINT "user_account_unique_index" UNIQUE("user_id","provider_id","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_favorite_bus_stop" (
	"user_id" uuid NOT NULL,
	"stop_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorite_bus_stop_user_id_stop_id_pk" PRIMARY KEY("user_id","stop_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_line" ADD CONSTRAINT "bus_line_agency_id_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agency"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
 ALTER TABLE "bus_stop" ADD CONSTRAINT "bus_stop_agency_id_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agency"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_time" ADD CONSTRAINT "bus_stop_time_agency_id_agency_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agency"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_time" ADD CONSTRAINT "bus_stop_time_line_id_bus_line_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."bus_line"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_time" ADD CONSTRAINT "bus_stop_time_route_id_bus_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."bus_route"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bus_stop_time" ADD CONSTRAINT "bus_stop_time_stop_id_bus_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."bus_stop"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "bus_stop_to_line" ADD CONSTRAINT "bus_stop_to_line_line_id_bus_line_id_fk" FOREIGN KEY ("line_id") REFERENCES "public"."bus_line"("id") ON DELETE cascade ON UPDATE no action;
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
 ALTER TABLE "bus_stop_to_route" ADD CONSTRAINT "bus_stop_to_route_route_id_bus_route_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."bus_route"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_account" ADD CONSTRAINT "user_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_favorite_bus_stop" ADD CONSTRAINT "user_favorite_bus_stop_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_favorite_bus_stop" ADD CONSTRAINT "user_favorite_bus_stop_stop_id_bus_stop_id_fk" FOREIGN KEY ("stop_id") REFERENCES "public"."bus_stop"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
