import {
  pgTable,
  pgEnum,
  text,
  integer,
  serial,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

// Enum – mirrors RecordStatus in types/index.ts
export const recordStatusEnum = pgEnum("record_status", [
  "pending",
  "approved",
  "flagged",
  "needs_revision",
]);

// recordsTable – main specimen table
export const recordsTable = pgTable("records", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    status: recordStatusEnum("status").notNull().default("pending"),
    note: text("note"),
    version: integer("version").notNull().default(1),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Heavily queried in filter + paginate operations
    index("idx_records_status").on(table.status),
    // Stable sort column for consistent pagination
    index("idx_records_created_at").on(table.createdAt),
  ]
);

// record_history – append-only audit log (replaces the in-memory history)
export const recordHistoryTable = pgTable("record_history",{
    id: serial("id").primaryKey(),

    /** FK to the record that was changed. */
    recordId: text("record_id").notNull().references(() => recordsTable.id, { onDelete: "cascade" }),

    previousStatus: recordStatusEnum("previous_status").notNull(),
    newStatus: recordStatusEnum("new_status").notNull(),
    note: text("note"),

    changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Per-record history lookups
    index("idx_record_history_record_id").on(table.recordId),
    // Chronological ordering of the full audit log
    index("idx_record_history_changed_at").on(table.changedAt),
  ]
);

// Inferred TypeScript types – use these instead of hand-writing interfaces
export type RecordRow = typeof recordsTable.$inferSelect;
export type NewRecordRow = typeof recordsTable.$inferInsert;

export type RecordHistoryRow = typeof recordHistoryTable.$inferSelect;
export type NewRecordHistoryRow = typeof recordHistoryTable.$inferInsert;