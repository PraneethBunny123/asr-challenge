/**
 * The records represent specimens or observations collected from the field. 
 * The `status` field reflects the current review state; `note` holds any reviewer notes.
 */
export type RecordStatus = 'pending' | 'approved' | 'flagged' | 'needs_revision';

export type Action = "create" | "update" | "delete"

export type AppRole = "viewer" | "reviewer" | "admin";

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

/** Shape of the input required to create a new record */
export interface CreateRecordInput {
  name: string;
  description: string;
  note?: string;
}

/** Shape of the value provided by the RecordsContext */
export interface RecordsContextValue {
  records: RecordItem[];
  loading: boolean;
  error: string | null;

  // pagination
  page: number;
  limit: number;
  totalCount: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  createRecord: (input: CreateRecordInput) => Promise<void>
  updateRecord: (
    id: string,
    updates: { status?: RecordStatus; note?: string; version: number },
  ) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>
  refresh: () => Promise<void>;
  history: RecordHistoryEntry[];
  clearHistory: () => void;
}