CREATE TABLE IF NOT EXISTS "user_favorite_bus_stop" (
	"user_id" uuid NOT NULL,
	"stop_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_favorite_bus_stop_user_id_stop_id_pk" PRIMARY KEY("user_id","stop_id")
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "user_account" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
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
