import type { RecordItem, RecordHistoryEntry } from "@/app/interview/types";
import type { RecordRow, RecordHistoryRow } from "./schema";

// Maps a raw Drizzle `RecordRow` to the `RecordItem` shape the client expects
export function toRecordItem(row: RecordRow): RecordItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    note: row.note ?? undefined,
    version: row.version,
  };
}

//Maps a raw Drizzle `RecordHistoryRow` to the `RecordHistoryEntry` shape the client expects

export function toHistoryEntry(row: RecordHistoryRow): RecordHistoryEntry {
  return {
    id: row.recordId,
    previousStatus: row.previousStatus,
    newStatus: row.newStatus,
    note: row.note ?? undefined,
    timestamp: row.changedAt.toISOString(),
  };
}