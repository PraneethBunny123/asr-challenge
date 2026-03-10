/**
 * The records represent specimens or observations collected from the field. 
 * The `status` field reflects the current review state; `note` holds any reviewer notes.
 */
export type RecordStatus = 'pending' | 'approved' | 'flagged' | 'needs_revision';

export interface RecordItem {
  id: string;
  name: string;
  status: RecordStatus;
  description: string;
  note?: string;

  version: number; // For concurrency control, incremented on each update
}

/** History entries are recorded whenever a record’s status changes */
export interface RecordHistoryEntry {
  id: string;
  previousStatus: RecordStatus;
  newStatus: RecordStatus;
  note?: string;
  timestamp: string;
}

/** Shape returned by GET /api/mock/records?page&limit */
export interface PaginatedRecordsResponse {
  records: RecordItem[];
  totalCount: number;
}

/** Shape of a 409 conflict response body */
export interface VersionConflictError {
  error: 'version_conflict';
  serverRecord: RecordItem;
}