ALTER TABLE "records" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_records_deleted_at" ON "records" USING btree ("deleted_at");