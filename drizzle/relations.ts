import { relations } from "drizzle-orm/relations";
import { records, recordHistory } from "./schema";

export const recordHistoryRelations = relations(recordHistory, ({one}) => ({
	record: one(records, {
		fields: [recordHistory.recordId],
		references: [records.id]
	}),
}));

export const recordsRelations = relations(records, ({many}) => ({
	recordHistories: many(recordHistory),
}));