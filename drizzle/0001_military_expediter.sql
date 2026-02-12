CREATE INDEX "bids_collection_idx" ON "bids" USING btree ("collection_id");--> statement-breakpoint
CREATE INDEX "bids_user_idx" ON "bids" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "bids_created_idx" ON "bids" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "bids_status_idx" ON "bids" USING btree ("status");--> statement-breakpoint
CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_idx" ON "sessions" USING btree ("expires_at");