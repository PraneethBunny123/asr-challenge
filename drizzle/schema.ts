import { pgTable, index, text, integer, timestamp, foreignKey, serial, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const recordStatus = pgEnum("record_status", ['pending', 'approved', 'flagged', 'needs_revision'])


export const records = pgTable("records", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	status: recordStatus().default('pending').notNull(),
	note: text(),
	version: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_records_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_records_status").using("btree", table.status.asc().nullsLast().op("enum_ops")),
]);

export const recordHistory = pgTable("record_history", {
	id: serial().primaryKey().notNull(),
	recordId: text("record_id").notNull(),
	previousStatus: recordStatus("previous_status").notNull(),
	newStatus: recordStatus("new_status").notNull(),
	note: text(),
	changedAt: timestamp("changed_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_record_history_changed_at").using("btree", table.changedAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_record_history_record_id").using("btree", table.recordId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.recordId],
			foreignColumns: [records.id],
			name: "record_history_record_id_records_id_fk"
		}).onDelete("cascade"),
]);
